/* eslint-disable no-console */
import type { VercelRequest, VercelResponse } from '@vercel/node';

import { order_by } from '../../../api-lib/gql/__generated__/zeus';
import { adminClient } from '../../../api-lib/gql/adminClient';
import { verifyHasuraRequestMiddleware } from '../../../api-lib/validate';
import {
  getMintInfoFromReceipt,
  mintCoSoulForAddress,
} from '../../../src/features/cosoul/api/cosoul';
import { minted } from '../actions/_handlers/syncCoSoul';

const LIMIT = 9;

async function handler(_req: VercelRequest, res: VercelResponse) {
  const gives = await giveToSync();

  console.log('Gives to write onchain: ', gives.length);
  console.log({ gives });

  try {
    let errors = 0;
    let success = 0;
    for (const give of gives) {
      try {
        console.log('Writing give onchain for give id: ', give.id);
        const tx = await attestGiveOnchain(give);
        const txReceipt = await tx.wait(); // TODO: don't need to wait i  dont think

        console.log(
          'Success: attested give for give.id : ',
          give.id,
          ' receiver address: ',
          give.receiver_profile_public?.address
        );

        await adminClient.mutate(
          {
            update_colinks_gives_by_pk: [
              {
                _set: {
                  tx_hash: txReceipt.transactionHash,
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

export async function giveToSync() {
  // get all give that is not on-chain
  const { colinks_gives } = await adminClient.query(
    {
      colinks_gives: [
        {
          where: {
            tx_hash: { _is_null: true },
          },
          order_by: [{ created_at: order_by.desc }],
          limit: LIMIT,
        },
        {
          id: true,
          giver_profile_public: {
            address: true,
          },
          receiver_profile_public: {
            address: true,
          },
          skill: true,
          warpcast_url: true,
          cast_url: true,
          activity_id: true,
        },
      ],
    },
    { operationName: 'cron_giveOnchainSyncer__getGives' }
  );
  return colinks_gives;
}

export default verifyHasuraRequestMiddleware(handler);
