import type { VercelRequest, VercelResponse } from '@vercel/node';

import { IS_LOCAL_ENV } from '../../../api-lib/config.ts';
import { order_by } from '../../../api-lib/gql/__generated__/zeus';
import { adminClient } from '../../../api-lib/gql/adminClient';
import { errorResponseWithStatusCode } from '../../../api-lib/HttpError.ts';
import { verifyHasuraRequestMiddleware } from '../../../api-lib/validate';
import { setBatchOnChainRep } from '../../../api-lib/viem/contracts.ts';

const SYNC_BATCH_SIZE = 100;

async function handler(_req: VercelRequest, res: VercelResponse) {
  if (IS_LOCAL_ENV) {
    return res
      .status(200)
      .json({ message: 'This endpoint is disabled in local environment.' });
  }

  // june 26th 2024, when new scores started;
  // TODO: change this to monthly syncing
  const checkpointDate = new Date('2024-06-26T00:00:00Z').toISOString();

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
            },
            cosoul: {
              _or: [
                {
                  rep_synced_at: {
                    _is_null: true,
                  },
                },
                {
                  rep_synced_at: {
                    _lte: checkpointDate,
                  },
                },
              ],
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
            token_id: true,
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
      `syncing rep score on chain for ${profiles.length} profiles starting at id ${profiles[0]?.id}`
    );

    const tx = await setBatchOnChainRep(
      profiles
        .map(p => ({
          tokenId: p.cosoul?.token_id ?? 0,
          amount: p.reputation_score?.total_score ?? 0,
        }))
        .filter(p => p.tokenId && p.amount)
    );
    if (!tx) {
      return errorResponseWithStatusCode(
        res,
        'failed to set on chain rep - no tx',
        500
      );
    }
    // eslint-disable-next-line no-console
    console.log(
      `synced rep score for ${profiles.length} profiles starting at id ${profiles[0]?.id} - tx: ${tx.transactionHash}`
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
