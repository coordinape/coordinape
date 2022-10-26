import assert from 'assert';

import type { VercelRequest, VercelResponse } from '@vercel/node';

import { adminClient } from '../../../../api-lib/gql/adminClient';
import { errorResponse } from '../../../../api-lib/HttpError';
import { verifyHasuraRequestMiddleware } from '../../../../api-lib/validate';
import {
  updateUserSchemaInput,
  composeHasuraActionRequestBodyWithSession,
  HasuraUserSessionVariables,
} from '../../../../src/lib/zod';

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

  const {
    members: [member],
  } = await adminClient.query({
    members: [
      {
        limit: 1,
        where: {
          address: { _ilike: address },
          circle_id: { _eq: circle_id },
          // ignore soft_deleted members
          deleted_at: { _is_null: true },
        },
      },
      {
        id: true,
        fixed_non_receiver: true,
        give_token_received: true,
      },
    ],
  });

  if (!member) {
    return errorResponse(res, {
      message: `Member with address ${address} does not exist`,
      code: 422,
    });
  }

  // Update the state after all external validations have passed

  const mutationResult = await adminClient.mutate(
    {
      update_members: [
        {
          _set: {
            ...payload,
            // reset give_token_received if a member is opted out of an
            // active epoch
            give_token_received:
              member.fixed_non_receiver || payload.non_receiver
                ? 0
                : member.give_token_received,
            // fixed_non_receiver === true is also set for non_receiver
            non_receiver: member.fixed_non_receiver || payload.non_receiver,
          },
          where: {
            address: { _ilike: address },
            circle_id: { _eq: circle_id },
            // ignore soft_deleted member
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
      operationName: 'updateUser_update',
    }
  );

  const returnResult = mutationResult.update_members?.returning.pop();
  assert(returnResult, 'No return from mutation');

  res.status(200).json(returnResult);
  return;
}

export default verifyHasuraRequestMiddleware(handler);
