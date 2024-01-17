import assert from 'assert';

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';

import { authCircleAdminMiddleware } from '../../../../api-lib/circleAdmin';
import { adminClient } from '../../../../api-lib/gql/adminClient';
import * as queries from '../../../../api-lib/gql/queries';
import { getInput } from '../../../../api-lib/handlerHelpers';
import { UnprocessableError } from '../../../../api-lib/HttpError';

const adminUpdateUserSchemaInput = z
  .object({
    circle_id: z.number(),
    profile_id: z.number(),
    starting_tokens: z.number().optional(),
    non_giver: z.boolean().optional(),
    fixed_non_receiver: z.boolean().optional(),
    non_receiver: z.boolean().optional(),
    role: z.number().min(0).max(1).optional(),
    fixed_payment_amount: z.number().min(0).max(100000000000).optional(),
  })
  .strict();

async function handler(req: VercelRequest, res: VercelResponse) {
  const { payload } = await getInput(req, adminUpdateUserSchemaInput, {
    allowAdmin: true,
  });

  // Validate no epoches are active for the requested user
  const { circle_id, profile_id } = payload;

  const user = await queries.getUserAndCurrentEpoch(profile_id, circle_id);
  if (!user) {
    throw new UnprocessableError(
      `User with profileId ${profile_id} does not exist`
    );
  }

  if (
    user.circle.epochs.length > 0 &&
    payload.starting_tokens &&
    payload.starting_tokens !== user.starting_tokens
  ) {
    throw new UnprocessableError(
      `Cannot update starting tokens during an active epoch`
    );
  }

  // Update the state after all external validations have passed

  // doing this spread to remove new_address from the updateInput
  const { ...updateInput } = payload;

  const mutationResult = await adminClient.mutate(
    {
      update_users: [
        {
          _set: {
            ...updateInput,
            // falls back to undefined and is therefore not updated in the DB
            // set remaining tokens to starting tokens if starting tokens
            // has been changed.
            give_token_remaining: payload.starting_tokens,
            // fixed_non_receiver === true is also set for non_receiver
            non_receiver: payload.fixed_non_receiver || payload.non_receiver,
          },
          where: {
            circle_id: { _eq: circle_id },
            profile_id: { _eq: profile_id },
          },
        },
        { returning: { id: true } },
      ],
    },
    { operationName: 'adminUpdateUser_update' }
  );

  const returnResult = mutationResult.update_users?.returning.pop();
  assert(returnResult, 'No return from mutation');

  res.status(200).json(returnResult);
  return;
}

export default authCircleAdminMiddleware(handler);
