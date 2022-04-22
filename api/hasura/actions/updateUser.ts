import assert from 'assert';

import type { VercelRequest, VercelResponse } from '@vercel/node';

import { adminClient } from '../../../api-lib/gql/adminClient';
import * as queries from '../../../api-lib/gql/queries';
import { errorResponse } from '../../../api-lib/HttpError';
import { verifyHasuraRequestMiddleware } from '../../../api-lib/validate';
import {
  updateUserSchemaInput,
  composeHasuraActionRequestBodyWithSession,
  HasuraUserSessionVariables,
} from '../../../src/lib/zod';

async function handler(req: VercelRequest, res: VercelResponse) {
  const {
    session_variables,
    input: { payload },
  } = composeHasuraActionRequestBodyWithSession(
    updateUserSchemaInput,
    HasuraUserSessionVariables
  ).parse(req.body);

  // Validate no epoches are active for the requested user
  const { circle_id } = payload;
  const { hasuraAddress: address } = session_variables;

  const user = await queries.getUserAndCurrentEpoch(address, circle_id);
  if (!user) {
    return errorResponse(res, {
      message: `User with address ${address} does not exist`,
      code: 422,
    });
  }

  // Update the state after all external validations have passed

  const mutationResult = await adminClient.mutate(
    {
      update_users: [
        {
          _set: {
            ...payload,
            // reset give_token_received if a user is opted out of an
            // active epoch
            give_token_received:
              user.fixed_non_receiver || payload.non_receiver
                ? 0
                : user.give_token_received,
            // fixed_non_receiver === true is also set for non_receiver
            non_receiver: user.fixed_non_receiver || payload.non_receiver,
          },
          where: {
            address: { _ilike: address },
            circle_id: { _eq: circle_id },
            // ignore soft_deleted users
            deleted_at: { _is_null: true },
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
      operationName: 'updateUser-update',
    }
  );

  const returnResult = mutationResult.update_users?.returning.pop();
  assert(returnResult, 'No return from mutation');

  res.status(200).json(returnResult);
  return;
}

export default verifyHasuraRequestMiddleware(handler);
