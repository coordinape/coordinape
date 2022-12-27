import type { VercelRequest, VercelResponse } from '@vercel/node';
import { DateTime } from 'luxon';

import { adminClient } from '../../../../api-lib/gql/adminClient';
import { errorResponseWithStatusCode } from '../../../../api-lib/HttpError';
import { authUserDeleterMiddleware } from '../../../../api-lib/userDeleter';
import {
  deleteUserInput,
  composeHasuraActionRequestBody,
} from '../../../../src/lib/zod';

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
      operationName: 'deleteUser_getExistingUser',
    }
  );

  if (!existingUser) {
    return errorResponseWithStatusCode(
      res,
      { message: 'User does not exist' },
      422
    );
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
      operationName: 'deleteUser_delete',
    }
  );

  return res.status(200).json({
    success: true,
  });
}

export default authUserDeleterMiddleware(handler);
