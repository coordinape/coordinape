import type { VercelRequest, VercelResponse } from '@vercel/node';

import { attestGiveOnchain } from '../../../api-lib/eas';
import { order_by } from '../../../api-lib/gql/__generated__/zeus';
import { adminClient } from '../../../api-lib/gql/adminClient';
import { verifyHasuraRequestMiddleware } from '../../../api-lib/validate';

const LIMIT = 10;

async function handler(_req: VercelRequest, res: VercelResponse) {
  const gives = await giveToSync();

  try {
    let errors = 0;
    let success = 0;
    for (const give of gives) {
      try {
        // eslint-disable-next-line no-console
        console.log('Writing give onchain for give id: ', give.id);
        const { attestUid, txHash } = await attestGiveOnchain(give);

        // eslint-disable-next-line no-console
        console.log(
          'Attested give for give.id : ',
          give.id,
          'attestUid: ',
          attestUid
        );

        await adminClient.mutate(
          {
            update_colinks_gives_by_pk: [
              {
                _set: {
                  attestation_uid: attestUid,
                  tx_hash: txHash,
                  onchain_synced_at: 'now()',
                },
                pk_columns: {
                  id: give.id,
                },
              },
              {
                __typename: true,
              },
            ],
          },
          {
            operationName: 'cron_giveOnchainSyncer__attestGive',
          }
        );

        success++;
      } catch (e: any) {
        errors++;

        await adminClient.mutate(
          {
            update_colinks_gives_by_pk: [
              {
                _set: {
                  onchain_sync_error: e.message,
                },
                pk_columns: {
                  id: give.id,
                },
              },
              {
                __typename: true,
              },
            ],
          },
          {
            operationName: 'cron_giveOnchainSyncer__attestGive__error',
          }
        );

        console.error(
          'Error while writing give onchain for give id : ',
          give.id,
          e.message
        );
      }
    }

    // eslint-disable-next-line no-console
    console.log('Syncing complete', { success, errors });
    res.status(200).json({
      success: true,
      gives: gives.length,
      errorsCount: errors,
      successCount: success,
    });
  } catch (e: any) {
    console.error('Error while syncing give onchain', e);
    res.status(500).json({
      success: false,
      error: e.message,
    });
  }
}

async function giveToSync() {
  // get all give that is not on-chain
  const { colinks_gives } = await adminClient.query(
    {
      colinks_gives: [
        {
          where: {
            onchain_synced_at: { _is_null: true },
            give_skill: {
              hidden: { _eq: false },
            },
          },
          order_by: [{ created_at: order_by.desc }],
          limit: LIMIT,
        },
        {
          id: true,
          giver_profile_public: {
            address: true,
          },
          target_profile_public: {
            address: true,
          },
          skill: true,
          warpcast_url: true,
          cast_hash: true,
          activity_id: true,
        },
      ],
    },
    { operationName: 'cron_giveOnchainSyncer__getGives' }
  );
  return colinks_gives;
}

export type Give = Awaited<ReturnType<typeof giveToSync>>[number];

export default verifyHasuraRequestMiddleware(handler);
