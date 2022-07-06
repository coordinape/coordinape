import type { VercelRequest, VercelResponse } from '@vercel/node';

import { authCircleAdminMiddleware } from '../../../../api-lib/circleAdmin';
import { adminClient } from '../../../../api-lib/gql/adminClient';
import { errorResponseWithStatusCode } from '../../../../api-lib/HttpError';
import {
  restoreCoordinapeInput,
  composeHasuraActionRequestBody,
} from '../../../../src/lib/zod';

async function handler(req: VercelRequest, res: VercelResponse) {
  const {
    input: { payload },
  } = composeHasuraActionRequestBody(restoreCoordinapeInput).parse(req.body);

  const { circle_id } = payload;

  const {
    users: [existingCoordinape],
  } = await adminClient.query(
    {
      users: [
        {
          limit: 1,
          where: {
            role: { _eq: 2 },
            circle_id: { _eq: circle_id },
            deleted_at: { _is_null: false },
          },
        },
        { id: true },
      ],
    },
    {
      operationName: 'deleteUser_getExistingUser',
    }
  );

  if (!existingCoordinape) {
    errorResponseWithStatusCode(res, { message: 'user does not exist' }, 422);
    return;
  }

  await adminClient.mutate(
    {
      update_users_by_pk: [
        {
          pk_columns: { id: existingCoordinape.id },
          _set: { deleted_at: null },
        },
        { __typename: true },
      ],
    },
    {
      operationName: 'restore_coordinape',
    }
  );

  res.status(200).json({
    success: true,
  });
}

export default authCircleAdminMiddleware(handler);
