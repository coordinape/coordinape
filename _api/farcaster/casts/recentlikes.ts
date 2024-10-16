import type { VercelRequest, VercelResponse } from '@vercel/node';

import { adminClient } from '../../../api-lib/gql/adminClient.ts';

const LIMIT = 5;
const TIME_PERIOD = '180 days';

export default async function handler(
  _req: VercelRequest,
  res: VercelResponse
) {
  const { most_reacted_casts } = await adminClient.query(
    {
      most_reacted_casts: [
        {
          args: {
            result_limit: LIMIT,
            time_period: TIME_PERIOD,
            reaction_type: 1,
          },
        },
        {
          target_hash: true,
          count: true,
        },
      ],
    },
    {
      operationName: 'recentLikes',
    }
  );
  res.status(200).json({ casts: most_reacted_casts });
}
