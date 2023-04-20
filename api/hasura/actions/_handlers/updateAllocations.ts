import assert from 'assert';

import type { VercelRequest, VercelResponse } from '@vercel/node';
import round from 'lodash/round';
import { z } from 'zod';

import { COORDINAPE_USER_ADDRESS } from '../../../../api-lib/config';
import { getUsersFromUserIds } from '../../../../api-lib/findUser';
import {
  ValueTypes,
  pending_token_gifts_constraint,
  pending_token_gifts_update_column,
} from '../../../../api-lib/gql/__generated__/zeus';
import { adminClient } from '../../../../api-lib/gql/adminClient';
import { getInput } from '../../../../api-lib/handlerHelpers';
import { errorResponseWithStatusCode } from '../../../../api-lib/HttpError';
import {
  getUserFromProfileIdWithCircle,
  getUserWithCircle,
  UserWithCircleResponse,
} from '../../../../api-lib/nominees';
import { verifyHasuraRequestMiddleware } from '../../../../api-lib/validate';

const updateAllocationsInput = z.object({
  allocations: z
    .object({
      recipient_id: z.number().int().positive(),
      tokens: z.number().int().min(0),
      note: z.string().max(5000).optional(),
    })
    .array(),
  circle_id: z.number().int().positive(),
});

const updateAllocationsApiInput = updateAllocationsInput.extend({
  user_id: z.number().int().positive().optional(),
});

async function handler(req: VercelRequest, res: VercelResponse) {
  const {
    payload: { circle_id, allocations },
    payload,
    session,
  } = await getInput(req, updateAllocationsApiInput, {
    apiPermissions: ['update_pending_token_gifts'],
  });

  let user: UserWithCircleResponse | null = null;

  // Since both api-users and users can call this action, we have different
  // handlers for fetching the target user
  if (session.hasuraRole === 'api-user') {
    assert(payload.user_id, 'user_id not specified');
    if (circle_id !== session.hasuraCircleId) {
      return errorResponseWithStatusCode(
        res,
        { message: `API Key does not belong to circle ID ${circle_id}` },
        403
      );
    }
    user = await getUserWithCircle(payload.user_id, circle_id);
  } else if (session.hasuraRole === 'user') {
    user = await getUserFromProfileIdWithCircle(
      session.hasuraProfileId,
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

  if (allocations.some(a => user && a.recipient_id === user.id)) {
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

  const updatedNotes = newAllocations.some(g => g.note);

  const allocationMutations = newAllocations.reduce((ops, gift) => {
    const recipient = eligibleRecipients.find(u => u.id === gift.recipient_id);
    if (!recipient) return ops;

    const giftTokens =
      user?.non_giver || recipient.non_receiver ? 0 : gift.tokens;
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
                  sender_id: user?.id,
                  sender_address: user?.address,
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
                  sender_id: { _eq: user?.id },
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

  const { users: grantees } = await adminClient.query(
    {
      users: [
        {
          where: {
            circle_id: { _eq: circle_id },
            profile: { address: { _eq: COORDINAPE_USER_ADDRESS } },
          },
        },
        { id: true },
      ],
    },
    { operationName: 'updateAllocations_getCoordinapeUser' }
  );
  const granteeUserId = grantees[0]?.id;
  const donation = newAllocations.find(g => g.recipient_id === granteeUserId);
  const granted = donation?.tokens ?? 0;
  const donation_percent =
    overallTokensUsed > 0 ? round(granted / overallTokensUsed, 2) * 100 : 0;

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
      insert_interaction_events: [
        {
          objects: [
            {
              event_type: 'update_allocations',
              profile_id: user.profile.id,
              circle_id: circle_id,
              data: { updated_notes: updatedNotes, donation_percent },
            },
          ],
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
