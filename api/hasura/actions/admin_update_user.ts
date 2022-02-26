import assert from 'assert';

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';

import { authCircleAdminMiddleware } from '../../../api-lib/circleAdmin';
import { gql } from '../../../api-lib/Gql';
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
    const { circle_id, address } = input;

    const {
      users: [user],
    } = await gql.q('query')({
      users: [
        {
          limit: 1,
          where: {
            address: { _ilike: address },
            circle_id: { _eq: circle_id },
            // ignore soft_deleted users
            deleted_at: { _is_null: true },
          },
        },
        {
          id: true,
          fixed_non_receiver: true,
          non_receiver: true,
          starting_tokens: true,
          give_token_remaining: true,
          pending_received_gifts: [
            {},
            {
              epoch_id: true,
              sender_id: true,
              sender_address: true,
              tokens: true,
            },
          ],
          circle: {
            epochs: [
              {
                where: {
                  _and: [
                    { end_date: { _gt: 'now()' } },
                    { start_date: { _lt: 'now()' } },
                  ],
                },
              },
              {
                start_date: true,
                end_date: true,
                id: true,
              },
            ],
          },
        },
      ],
    });

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

    // TODO possibly move this deletion to an event eventually
    if (
      currentEpoch &&
      !user.non_receiver &&
      (input.non_receiver || input.fixed_non_receiver)
    ) {
      const currentPendingGifts = user.pending_received_gifts.filter(
        gift => gift.epoch_id === currentEpoch.id && gift.tokens > 0
      );

      if (currentPendingGifts.length > 0) {
        await gql.q('mutation')({
          delete_pending_token_gifts: [
            {
              where: {
                epoch_id: { _eq: currentEpoch.id },
                recipient_id: { _eq: user.id },
              },
            },
            { __typename: true },
          ],
        });
      }
    }

    const mutationResult = await gql.q('mutation')({
      update_users: [
        {
          _set: {
            ...input,
            // reset remaining tokens to starting tokens
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
            circle_id: true,
            address: true,
            name: true,
            non_giver: true,
            starting_tokens: true,
            fixed_non_receiver: true,
            non_receiver: true,
            role: true,
          },
        },
      ],
    });

    const returnResult = mutationResult.update_users?.returning.pop();
    assert(returnResult, 'No return from mutation');

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
