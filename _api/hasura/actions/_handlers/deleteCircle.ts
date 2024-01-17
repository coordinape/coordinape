import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';

import { authCircleAdminMiddleware } from '../../../../api-lib/circleAdmin';
import { adminClient } from '../../../../api-lib/gql/adminClient';
import { getInput } from '../../../../api-lib/handlerHelpers';
import { errorResponseWithStatusCode } from '../../../../api-lib/HttpError';

const deleteCircleInput = z.object({ circle_id: z.number() }).strict();

async function handler(req: VercelRequest, res: VercelResponse) {
  const { payload } = await getInput(req, deleteCircleInput, {
    allowAdmin: true,
  });

  const { circle_id } = payload;

  const { circles_by_pk: circle } = await adminClient.query(
    { circles_by_pk: [{ id: circle_id }, { deleted_at: true }] },
    { operationName: 'deleteCircle_getCircleStatus' }
  );

  if (!circle || circle?.deleted_at) {
    errorResponseWithStatusCode(res, { message: 'circle does not exist' }, 422);
    return;
  }

  await adminClient.mutate(
    {
      update_circles_by_pk: [
        { pk_columns: { id: circle_id }, _set: { deleted_at: 'now()' } },
        { __typename: true },
      ],
    },
    { operationName: 'deleteCircle_delete' }
  );

  res.status(200).json({ success: true });
}

export default authCircleAdminMiddleware(handler);
