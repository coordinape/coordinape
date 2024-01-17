import assert from 'assert';

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { DateTime, Settings } from 'luxon';
import { z } from 'zod';

import { authCircleAdminMiddleware } from '../../../../api-lib/circleAdmin';
import { adminClient } from '../../../../api-lib/gql/adminClient';
import { getInput } from '../../../../api-lib/handlerHelpers';

export const deleteEpochInput = z
  .object({
    id: z.number().int().positive(),
    circle_id: z.number().int().positive(),
  })
  .strict();

Settings.defaultZone = 'utc';

async function handler(req: VercelRequest, res: VercelResponse) {
  const { payload } = await getInput(req, deleteEpochInput, {
    allowAdmin: true,
  });

  const { circle_id, id } = payload;
  const { delete_epochs } = await adminClient.mutate(
    {
      delete_epochs: [
        {
          where: {
            // Check circle_id to ensure epoch is part of this circle
            circle_id: { _eq: circle_id },
            id: { _eq: id },
            start_date: { _gt: DateTime.now().toISO() },
            ended: { _eq: false },
          },
        },
        { affected_rows: true },
      ],
    },
    { operationName: 'deleteEpoch_delete' }
  );
  assert(delete_epochs);
  return res.status(200).json({ success: delete_epochs.affected_rows === 1 });
}

export default authCircleAdminMiddleware(handler);
