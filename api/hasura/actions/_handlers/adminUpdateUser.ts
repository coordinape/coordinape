import assert from 'assert';

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';

import { authCircleAdminMiddleware } from '../../../../api-lib/circleAdmin';
import { adminClient } from '../../../../api-lib/gql/adminClient';
import * as queries from '../../../../api-lib/gql/queries';
import {
  errorResponseWithStatusCode,
  UnprocessableError,
} from '../../../../api-lib/HttpError';
import { composeHasuraActionRequestBody } from '../../../../api-lib/requests/schema';
import { zEthAddressOnly } from '../../../../src/lib/zod/formHelpers';

const adminUpdateUserSchemaInput = z
  .object({
    circle_id: z.number(),
    address: zEthAddressOnly,
    new_address: zEthAddressOnly.optional(),
    starting_tokens: z.number().optional(),
    non_giver: z.boolean().optional(),
    fixed_non_receiver: z.boolean().optional(),
    non_receiver: z.boolean().optional(),
    role: z.number().min(0).max(1).optional(),
    fixed_payment_amount: z.number().min(0).max(100000000000).optional(),
  })
  .strict();

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
        operationName: 'adminUpdateUser_getExistingUser',
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

  // doing this spread to remove new_address from the updateInput
  const { new_address: newAddress, ...updateInput } = input;

  const mutationResult = await adminClient.mutate(
    {
      update_users: [
        {
          _set: {
            ...updateInput,
            // falls back to undefined and is therefore not updated in the DB
            // if new_address is not included
            address: newAddress,
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
      operationName: 'adminUpdateUser_update',
    }
  );

  const returnResult = mutationResult.update_users?.returning.pop();
  assert(returnResult, 'No return from mutation');

  res.status(200).json(returnResult);
  return;
}

export default authCircleAdminMiddleware(handler);
