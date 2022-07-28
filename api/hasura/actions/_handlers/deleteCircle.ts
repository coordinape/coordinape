import type { VercelRequest, VercelResponse } from '@vercel/node';

import { authCircleAdminMiddleware } from '../../../../api-lib/circleAdmin';
import { adminClient } from '../../../../api-lib/gql/adminClient';
import { errorResponseWithStatusCode } from '../../../../api-lib/HttpError';
import {
  deleteCircleInput,
  composeHasuraActionRequestBody,
} from '../../../../src/lib/zod';

async function handler(req: VercelRequest, res: VercelResponse) {
  const {
    input: { payload },
  } = composeHasuraActionRequestBody(deleteCircleInput).parse(req.body);

  const { circle_id } = payload;

  const {
    circles: [existingCircle],
  } = await adminClient.query(
    {
      circles: [
        {
          limit: 1,
          where: {
            id: { _eq: circle_id },
            // ignore soft_deleted circles
            deleted_at: { _is_null: true },
          },
        },
        { id: true },
      ],
    },
    {
      operationName: 'deleteCircle_getExistingCircle',
    }
  );

  if (!existingCircle) {
    errorResponseWithStatusCode(res, { message: 'circle does not exist' }, 422);
    return;
  }

  await adminClient.mutate(
    {
      update_circles_by_pk: [
        {
          pk_columns: { id: existingCircle.id },
          _set: { deleted_at: 'now()' },
        },
        { __typename: true },
      ],
    },
    {
      operationName: 'deleteCircle_delete',
    }
  );

  res.status(200).json({
    success: true,
  });
}

export default authCircleAdminMiddleware(handler);
