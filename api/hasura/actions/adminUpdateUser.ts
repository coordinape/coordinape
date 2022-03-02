import assert from 'assert';

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';

import { authCircleAdminMiddleware } from '../../../api-lib/circleAdmin';
import { gql } from '../../../api-lib/Gql';
import { ErrorResponseWithStatusCode } from '../../../api-lib/HttpError';
import {
  adminUpdateUserSchemaInput,
  composeHasuraActionRequestBody,
} from '../../../src/lib/zod';

async function handler(request: VercelRequest, response: VercelResponse) {
  try {
    const {
      input: { object: input },
    } = composeHasuraActionRequestBody(adminUpdateUserSchemaInput).parse(
      request.body
    );

    // Validate no epoches are active for the requested user
    const { circle_id, address, new_address } = input;

    if (new_address) {
      const {
        users: [existingUserWithNewAddress],
      } = await gql.q('query')({
        users: [
          {
            limit: 1,
            where: {
              address: { _ilike: new_address },
              circle_id: { _eq: circle_id },
              // ignore soft_deleted users
              deleted_at: { _is_null: true },
            },
          },
          { id: true },
        ],
      });

      if (existingUserWithNewAddress) {
        ErrorResponseWithStatusCode(
          response,
          { message: 'address exists' },
          422
        );
        return;
      }
    }

    const user = await gql.getUserAndCurrentEpoch(address, circle_id);
    if (!user) {
      return response.status(422).json({
        message: `User with address ${address} does not exist`,
        code: '422',
      });
    }

    if (user.circle.epochs.length > 0 && input.starting_tokens) {
      return response.status(422).json({
        message: 'Cannot update starting tokens during an active epoch',
        code: '422',
      });
    }

    // invariant: there can only be one active epoch in a circle
    // at a given time.
    const currentEpoch = user.circle.epochs.pop();

    // Update the state after all external validations have passed

    const mutationResult = await gql.q('mutation')({
      update_users: [
        {
          _set: {
            ...input,
            // falls back to undefined and is therefore not updated in the DB
            // if new_address is not included
            address: input.new_address,
            // reset give_token_received if a user is opted out of an
            // active epoch
            give_token_received:
              input.fixed_non_receiver || input.non_receiver
                ? 0
                : user.give_token_received,
            // set remaining tokens to starting tokens if starting tokens
            // has been changed.
            give_token_remaining:
              input.starting_tokens ?? user.give_token_remaining,
            // fixed_non_receiver === true is also set for non_receiver
            non_receiver: input.fixed_non_receiver || input.non_receiver,
          },
          where: {
            _and: [
              { circle_id: { _eq: circle_id } },
              {
                address: {
                  _ilike: address,
                },
              },
            ],
          },
        },
        {
          returning: {
            id: true,
          },
        },
      ],
    });

    const returnResult = mutationResult.update_users?.returning.pop();
    assert(returnResult, 'No return from mutation');

    // TODO possibly move this deletion to an event eventually
    if (currentEpoch) {
      const currentPendingReceivedGifts = user.pending_received_gifts.filter(
        gift => gift.epoch_id === currentEpoch.id && gift.tokens > 0
      );

      if (
        !user.non_receiver &&
        (input.non_receiver || input.fixed_non_receiver) &&
        currentPendingReceivedGifts.length > 0
      ) {
        await gql.q('mutation')({
          delete_pending_token_gifts: [
            {
              where: {
                epoch_id: { _eq: currentEpoch.id },
                recipient_id: { _eq: user.id },
                note: { _eq: '' },
              },
            },
            // something needs to be returned in the mutation
            { __typename: true },
          ],
          update_pending_token_gifts: [
            {
              _set: { tokens: 0 },
              where: {
                epoch_id: { _eq: currentEpoch.id },
                recipient_id: { _eq: user.id },
                _not: { note: { _eq: '' } },
              },
            },
            { __typename: true },
          ],
        });
      }

      const currentPendingSentGifts = user.pending_sent_gifts.filter(
        gift => gift.epoch_id === currentEpoch.id && gift.tokens > 0
      );
      if (
        !user.non_giver &&
        input.non_giver &&
        currentPendingSentGifts.length > 0
      ) {
        await gql.q('mutation')({
          delete_pending_token_gifts: [
            {
              where: {
                epoch_id: { _eq: currentEpoch.id },
                sender_id: { _eq: user.id },
                note: { _eq: '' },
              },
            },
            // something needs to be returned in the mutation
            { __typename: true },
          ],
          update_pending_token_gifts: [
            {
              _set: { tokens: 0 },
              where: {
                epoch_id: { _eq: currentEpoch.id },
                sender_id: { _eq: user.id },
                _not: { note: { _eq: '' } },
              },
            },
            { __typename: true },
          ],
        });
      }
    }

    response.status(200).json(returnResult);
    return;
  } catch (err) {
    if (err instanceof z.ZodError) {
      response.status(422).json({
        extensions: err.issues,
        message: 'Invalid input',
        code: '422',
      });
      return;
    }
    // throw unexpected errors to be caught by the outer 500-level response
    throw err;
  }
}

export default authCircleAdminMiddleware(handler);
