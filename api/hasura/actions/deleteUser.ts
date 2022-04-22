import type { VercelRequest, VercelResponse } from '@vercel/node';
import { DateTime } from 'luxon';

import { authCircleAdminMiddleware } from '../../../api-lib/circleAdmin';
import { adminClient } from '../../../api-lib/gql/adminClient';
import { errorResponseWithStatusCode } from '../../../api-lib/HttpError';
import {
  deleteUserInput,
  composeHasuraActionRequestBody,
} from '../../../src/lib/zod';

async function handler(req: VercelRequest, res: VercelResponse) {
  const {
    input: { payload },
  } = composeHasuraActionRequestBody(deleteUserInput).parse(req.body);

  const { circle_id, address } = payload;

  const {
    users: [existingUser],
  } = await adminClient.query(
    {
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
        { id: true },
      ],
    },
    {
      operationName: 'deleteUser-getExistingUser',
    }
  );

  if (!existingUser) {
    errorResponseWithStatusCode(res, { message: 'user does not exist' }, 422);
    return;
  }

  await adminClient.mutate(
    {
      update_users_by_pk: [
        {
          pk_columns: { id: existingUser.id },
          _set: { deleted_at: DateTime.now().toISO() },
        },
        { __typename: true },
      ],
      delete_teammates: [
        {
          where: {
            _or: [
              { user_id: { _eq: existingUser.id } },
              { team_mate_id: { _eq: existingUser.id } },
            ],
          },
        },
        { __typename: true },
      ],
    },
    {
      operationName: 'deleteUser-delete',
    }
  );

  res.status(200).json({
    success: true,
  });
}

export default authCircleAdminMiddleware(handler);
