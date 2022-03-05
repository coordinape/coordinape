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
      input: { payload: input },
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

    // Update the state after all external validations have passed

    const mutationResult = await gql.q('mutation')({
      update_users: [
        {
          _set: {
            ...input,
            // falls back to undefined and is therefore not updated in the DB
            // if new_address is not included
            address: input.new_address,
            // set remaining tokens to starting tokens if starting tokens
            // has been changed.
            give_token_remaining: input.starting_tokens,
            // fixed_non_receiver === true is also set for non_receiver
            non_receiver: input.fixed_non_receiver || input.non_receiver,
          },
          where: {
            circle_id: { _eq: circle_id },
            address: { _ilike: address },
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
