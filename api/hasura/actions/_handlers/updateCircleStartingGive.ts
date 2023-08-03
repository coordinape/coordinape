import assert from 'assert';

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';

import { authCircleAdminMiddleware } from '../../../../api-lib/circleAdmin';
import { adminClient } from '../../../../api-lib/gql/adminClient';
import { getInput } from '../../../../api-lib/handlerHelpers';
import {
  errorResponseWithStatusCode,
  UnprocessableError,
} from '../../../../api-lib/HttpError';

const updateCircleStartingGiveInput = z
  .object({
    circle_id: z.number(),
    starting_tokens: z.number().optional(),
  })
  .strict();

async function handler(req: VercelRequest, res: VercelResponse) {
  const { payload } = await getInput(req, updateCircleStartingGiveInput, {
    allowAdmin: true,
  });

  // Validate no epochs are active for the this circle
  const { circle_id } = payload;
  const { circles_by_pk: circle } = await adminClient.query(
    {
      circles_by_pk: [
        {
          id: circle_id,
        },
        {
          id: true,
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
              id: true,
            },
          ],
        },
      ],
    },
    { operationName: 'adminUpdateUser_getExistingUser' }
  );

  if (!circle) {
    errorResponseWithStatusCode(res, { message: 'circle not found' }, 422);
    return;
  }
  if (circle.epochs.length > 0) {
    throw new UnprocessableError(
      `Cannot update starting tokens during an active epoch`
    );
  }

  // Update the state after all external validations have passed
  const mutationResult = await adminClient.mutate(
    {
      update_circles_by_pk: [
        {
          _set: { starting_tokens: payload.starting_tokens },
          pk_columns: { id: circle_id },
        },
        { id: true },
      ],

      update_users: [
        {
          _set: {
            ...payload,
            // set remaining tokens to starting tokens
            give_token_remaining: payload.starting_tokens,
          },
          where: {
            circle_id: { _eq: circle_id },
          },
        },
        { returning: { id: true } },
      ],
    },
    { operationName: 'updateCircleStartingGive_update' }
  );

  const circleId = mutationResult.update_circles_by_pk?.id;
  const returnResult = mutationResult.update_users?.returning;
  assert(returnResult && circleId, 'No return from mutation');

  res.status(200).json({ success: true });
  return;
}

export default authCircleAdminMiddleware(handler);
