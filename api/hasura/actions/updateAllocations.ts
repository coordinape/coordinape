import assert from 'assert';

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';

import { getUsersFromUserIds } from '../../../api-lib/findUser';
import {
  ValueTypes,
  pending_token_gifts_constraint,
  pending_token_gifts_update_column,
} from '../../../api-lib/gql/__generated__/zeus';
import { adminClient } from '../../../api-lib/gql/adminClient';
import { errorResponseWithStatusCode } from '../../../api-lib/HttpError';
import {
  getUserFromProfileIdWithCircle,
  getUserWithCircle,
  UserWithCircleResponse,
} from '../../../api-lib/nominees';
import { verifyHasuraRequestMiddleware } from '../../../api-lib/validate';
import {
  updateAllocationsInput,
  composeHasuraActionRequestBodyWithSession,
  HasuraUserSessionVariables,
  updateAllocationsApiInput,
  composeHasuraActionRequestBodyWithApiPermissions,
} from '../../../src/lib/zod';

const userRequestSchema = composeHasuraActionRequestBodyWithSession(
  updateAllocationsInput,
  HasuraUserSessionVariables
);

const apiRequestSchema = composeHasuraActionRequestBodyWithApiPermissions(
  updateAllocationsApiInput,
  ['update_pending_token_gifts']
);

const requestSchema = z.union([userRequestSchema, apiRequestSchema]);

async function handler(req: VercelRequest, res: VercelResponse) {
  const requestData = await requestSchema.parseAsync(req.body);

  const {
    input: { payload: input },
    session_variables: sessionVariables,
  } = requestData;
  const { circle_id, allocations } = input;

  let user: UserWithCircleResponse;

  // Since both api-users and users can call this action, we have different
  // handlers for fetching the target user
  if (sessionVariables.hasuraRole === 'api-user') {
    // technically zod already validated this but TS needs explicit narrowing here
    assert('user_id' in input, 'user_id not specified');
    if (circle_id !== sessionVariables.hasuraCircleId) {
      return errorResponseWithStatusCode(
        res,
        { message: `API Key does not belong to circle ID ${circle_id}` },
        403
      );
    }
    user = await getUserWithCircle(input.user_id, circle_id);
  } else {
    user = await getUserFromProfileIdWithCircle(
      sessionVariables.hasuraProfileId,
      circle_id
    );
  }

  if (!user) {
    return errorResponseWithStatusCode(
      res,
      { message: 'User does not belong to this circle' },
      422
    );
  }
  const currentEpoch = user.circle.epochs.pop();
  if (!currentEpoch) {
    return errorResponseWithStatusCode(
      res,
      { message: 'No Active Epoch' },
      422
    );
  }

  if (allocations.some(a => a.recipient_id === user.id)) {
    return errorResponseWithStatusCode(
      res,
      { message: 'You cannot allocate to yourself' },
      422
    );
  }

  const uniqueValues = new Set(allocations.map(v => v.recipient_id));

  if (uniqueValues.size < allocations.length) {
    return errorResponseWithStatusCode(
      res,
      {
        message:
          'You cannot allocate to the same recipient twice in the same request',
      },
      422
    );
  }
  // get eligible recipients that are in this circle
  const eligibleRecipients = await getUsersFromUserIds(
    allocations.map(a => a.recipient_id),
    circle_id
  );
  if (!eligibleRecipients.length) {
    return errorResponseWithStatusCode(
      res,
      { message: 'Recipient does not belong to this circle' },
      422
    );
  }
  const { pending_sent_gifts, starting_tokens } = user;

  const newAllocations = allocations.filter(a =>
    // filter and leave only those that are eligible
    eligibleRecipients.some(u => u.id === a.recipient_id)
  );

  const existingAllocations = pending_sent_gifts.filter(
    // filter away new allocations that intersects with existing allocations so we don't double count
    g => !newAllocations.some(u => u.recipient_id === g.recipient_id)
  );

  // add up the tokens of existing allocations
  let overallTokensUsed = existingAllocations.length
    ? existingAllocations
        .map(g => g.tokens)
        .reduce((total, tokens) => tokens + total)
    : 0;

  const allocationMutations = newAllocations.reduce((ops, gift) => {
    const recipient = eligibleRecipients.find(u => u.id === gift.recipient_id);
    if (!recipient) return ops;

    const giftTokens =
      user.non_giver || recipient.non_receiver ? 0 : gift.tokens;
    overallTokensUsed += giftTokens;
    const existingGift = pending_sent_gifts.find(
      g => g.recipient_id === gift.recipient_id
    );
    ops['updateUser' + gift.recipient_id] = {
      update_users_by_pk: [
        {
          pk_columns: { id: gift.recipient_id },
          _inc: {
            give_token_received: existingGift
              ? giftTokens - existingGift.tokens
              : giftTokens,
          },
        },
        { __typename: true },
      ],
    };
    ops['giftMutation' + gift.recipient_id] =
      giftTokens > 0 || gift.note
        ? {
            insert_pending_token_gifts_one: [
              {
                object: {
                  ...gift,
                  circle_id,
                  epoch_id: currentEpoch.id,
                  sender_id: user.id,
                  sender_address: user.address,
                  recipient_address: recipient.address,
                  tokens: giftTokens,
                },
                on_conflict: {
                  constraint:
                    pending_token_gifts_constraint.pending_token_gifts_sender_id_recipient_id_epoch_id_key,
                  update_columns: [
                    pending_token_gifts_update_column.tokens,
                    pending_token_gifts_update_column.note,
                    pending_token_gifts_update_column.sender_address,
                    pending_token_gifts_update_column.recipient_address,
                  ],
                },
              },
              { __typename: true },
            ],
          }
        : {
            delete_pending_token_gifts: [
              {
                where: {
                  epoch_id: { _eq: currentEpoch.id },
                  sender_id: { _eq: user.id },
                  recipient_id: { _eq: gift.recipient_id },
                  circle_id: { _eq: circle_id },
                },
              },
              { __typename: true },
            ],
          };

    return ops;
  }, {} as { [aliasKey: string]: ValueTypes['mutation_root'] });

  if (starting_tokens < overallTokensUsed) {
    return errorResponseWithStatusCode(
      res,
      { message: 'You cannot allocate more than your total starting tokens' },
      422
    );
  }

  await adminClient.mutate(
    {
      update_users_by_pk: [
        {
          pk_columns: { id: user.id },
          _set: {
            give_token_remaining: starting_tokens - overallTokensUsed,
          },
        },
        { __typename: true },
      ],
      __alias: {
        ...allocationMutations,
      },
    },
    {
      operationName: 'updateAllocations_updateUsers',
    }
  );

  return res.status(200).json({ user_id: user.id });
}

export default verifyHasuraRequestMiddleware(handler);
