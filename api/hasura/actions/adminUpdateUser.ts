import assert from 'assert';

import type { VercelRequest, VercelResponse } from '@vercel/node';

import { authCircleAdminMiddleware } from '../../../api-lib/circleAdmin';
import { adminClient } from '../../../api-lib/gql/adminClient';
import * as queries from '../../../api-lib/gql/queries';
import {
  errorResponseWithStatusCode,
  UnprocessableError,
} from '../../../api-lib/HttpError';
import {
  adminUpdateUserSchemaInput,
  composeHasuraActionRequestBody,
} from '../../../src/lib/zod';

async function handler(req: VercelRequest, res: VercelResponse) {
  const {
    input: { payload: input },
  } = composeHasuraActionRequestBody(adminUpdateUserSchemaInput).parse(
    req.body
  );

  // Validate no epoches are active for the requested user
  const { circle_id, address, new_address } = input;

  // new_address that matches existing address can pass through
  if (new_address && new_address !== address) {
    const {
      users: [existingUserWithNewAddress],
    } = await adminClient.query(
      {
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
      },
      {
        operationName: 'adminUpdateUser-getExistingUser',
      }
    );

    if (existingUserWithNewAddress) {
      errorResponseWithStatusCode(res, { message: 'address exists' }, 422);
      return;
    }
  }

  const user = await queries.getUserAndCurrentEpoch(address, circle_id);
  if (!user) {
    throw new UnprocessableError(`User with address ${address} does not exist`);
  }

  if (
    user.circle.epochs.length > 0 &&
    input.starting_tokens &&
    input.starting_tokens !== user.starting_tokens
  ) {
    throw new UnprocessableError(
      `Cannot update starting tokens during an active epoch`
    );
  }

  // Update the state after all external validations have passed

  const mutationResult = await adminClient.mutate(
    {
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
      update_nominees: [
        {
          _set: { ended: true },
          where: {
            circle_id: { _eq: circle_id },
            address: { _ilike: input.new_address },
            ended: { _eq: false },
          },
        },
        {
          returning: {
            id: true,
          },
        },
      ],
    },
    {
      operationName: 'adminUpdateUser-update',
    }
  );

  const returnResult = mutationResult.update_users?.returning.pop();
  assert(returnResult, 'No return from mutation');

  res.status(200).json(returnResult);
  return;
}

export default authCircleAdminMiddleware(handler);
