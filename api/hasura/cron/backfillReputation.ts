import type { VercelRequest, VercelResponse } from '@vercel/node';

import { order_by } from '../../../api-lib/gql/__generated__/zeus';
import { adminClient } from '../../../api-lib/gql/adminClient';
import { verifyHasuraRequestMiddleware } from '../../../api-lib/validate';
import { updateRepScore } from '../../../src/features/rep/api/updateRepScore';

async function handler(req: VercelRequest, res: VercelResponse) {
  // get profiles without reputation
  const { profiles } = await adminClient.query(
    {
      profiles: [
        {
          limit: 100,
          order_by: [{ id: order_by.asc }],
          where: {
            _not: {
              reputation_score: {},
            },
          },
        },
        {
          id: true,
        },
      ],
    },
    {
      operationName: 'getProfilesForScoreBackfill',
    }
  );

  if (profiles.length) {
    // eslint-disable-next-line no-console
    console.log(
      `updating rep score for ${profiles.length} profiles starting at id ${profiles[0]?.id}`
    );
    // Update the batch in parallel
    await Promise.all(profiles.map(p => updateRepScore(p.id)));
    // eslint-disable-next-line no-console
    console.log(
      `updated rep score for ${profiles.length} profiles starting at id ${profiles[0]?.id}`
    );
  } else {
    // eslint-disable-next-line no-console
    console.log('no profiles need rep score update');
  }

  res.status(200).json({
    success: true,
  });
}

export default verifyHasuraRequestMiddleware(handler);
