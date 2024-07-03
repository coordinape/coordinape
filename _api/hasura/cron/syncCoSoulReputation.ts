import type { VercelRequest, VercelResponse } from '@vercel/node';

import { IS_LOCAL_ENV } from '../../../api-lib/config.ts';
import { order_by } from '../../../api-lib/gql/__generated__/zeus';
import { adminClient } from '../../../api-lib/gql/adminClient';
import { verifyHasuraRequestMiddleware } from '../../../api-lib/validate';

const SYNC_BATCH_SIZE = 100;

async function handler(_req: VercelRequest, res: VercelResponse) {
  if (IS_LOCAL_ENV) {
    return res
      .status(200)
      .json({ message: 'This endpoint is disabled in local environment.' });
  }

  // june 26th 2024, when new scores started
  const checkpointDate = new Date('2024-07-03T00:00:00Z');

  // get profiles w/ cosouls that have reputation needing syncing
  // only include people with nonzero score, updated after checkpoint, and cosoul rep_synced_at before checkpoint
  const { profiles } = await adminClient.query(
    {
      profiles: [
        {
          limit: SYNC_BATCH_SIZE,
          order_by: [{ id: order_by.asc }],
          where: {
            reputation_score: {
              total_score: {
                _gt: 0,
              },
              updated_at: {
                _gt: checkpointDate,
              },
            },
            cosoul: {
              rep_synced_at: {
                _lte: checkpointDate,
              },
            },
          },
        },
        {
          id: true,
          reputation_score: {
            total_score: true,
          },
          cosoul: {
            id: true,
          },
        },
      ],
    },
    {
      operationName: 'getProfilesForRepScoreSyncing',
    }
  );

  if (profiles.length) {
    // eslint-disable-next-line no-console
    console.log(
      `updating rep score for ${profiles.length} profiles starting at id ${profiles[0]?.id}`
    );
    // Update the batch in parallel
    // TODO: change this to batch sync on chain
    // BATCH SYNC ON CHAIN HERE
    // await Promise.all(profiles.map(p => updateRepScore(p.id)));
    // eslint-disable-next-line no-console
    console.log(
      `updated rep score for ${profiles.length} profiles starting at id ${profiles[0]?.id}`
    );
    await adminClient.mutate(
      {
        update_cosouls_many: [
          {
            updates: profiles.map(p => ({
              where: {
                id: { _eq: p.cosoul?.id },
              },
              _set: {
                rep_synced_at: 'now()',
                rep_score: p.reputation_score?.total_score,
              },
            })),
          },
          {
            affected_rows: true,
          },
        ],
      },
      {
        operationName: 'updateCoSoulRepSyncedAt',
      }
    );
  } else {
    // eslint-disable-next-line no-console
    console.log('no profiles need rep score sync');
  }

  res.status(200).json({
    success: true,
  });
}

export default verifyHasuraRequestMiddleware(handler);
