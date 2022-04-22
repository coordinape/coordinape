import assert from 'assert';

import type { VercelRequest, VercelResponse } from '@vercel/node';

import { authCircleAdminMiddleware } from '../../../api-lib/circleAdmin';
import { adminClient } from '../../../api-lib/gql/adminClient';
import {
  deleteEpochInput,
  composeHasuraActionRequestBody,
} from '../../../src/lib/zod';

async function handler(req: VercelRequest, res: VercelResponse) {
  const {
    input: { payload: input },
  } = composeHasuraActionRequestBody(deleteEpochInput).parse(req.body);

  const { circle_id, id } = input;
  const { delete_epochs } = await adminClient.mutate(
    {
      delete_epochs: [
        {
          where: {
            // Check circle_id to ensure epoch is part of this circle
            circle_id: { _eq: circle_id },
            id: { _eq: id },
            start_date: { _gt: new Date() },
            ended: { _eq: false },
          },
        },
        {
          affected_rows: true,
        },
      ],
    },
    {
      operationName: 'deleteEpoch-delete',
    }
  );
  assert(delete_epochs);
  return res.status(200).json({ success: delete_epochs.affected_rows === 1 });
}

export default authCircleAdminMiddleware(handler);
