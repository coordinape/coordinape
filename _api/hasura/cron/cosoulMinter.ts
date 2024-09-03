/* eslint-disable no-console */
import type { VercelRequest, VercelResponse } from '@vercel/node';

import { order_by } from '../../../api-lib/gql/__generated__/zeus';
import { adminClient } from '../../../api-lib/gql/adminClient';
import { verifyHasuraRequestMiddleware } from '../../../api-lib/validate';
import {
  getMintInfoFromReceipt,
  mintCoSoulForAddress,
} from '../../../api-lib/viem/contracts';
import { minted } from '../actions/_handlers/syncCoSoul';

const LIMIT = 9;

async function handler(_req: VercelRequest, res: VercelResponse) {
  let profiles = await giversToMint('receiver');
  if (profiles.length === 0) {
    profiles = await giversToMint('giver');
  }

  console.log('Profiles to mint: ', profiles.length);
  console.log({ profiles });

  try {
    let errors = 0;
    let success = 0;
    for (const p of profiles) {
      try {
        console.log('Minting CoSouls for address: ', p.address);
        const txReceipt = await mintCoSoulForAddress(p.address);
        const { tokenId } = await getMintInfoFromReceipt(txReceipt);

        // sync now or not?
        await minted(
          p.address,
          txReceipt.transactionHash,
          Number(tokenId),
          p.id,
          true
        );
        console.log(
          'Success: minted tokenId: ',
          tokenId,
          ' for address: ',
          p.address
        );
        success++;
      } catch (e: any) {
        errors++;
        await adminClient.mutate(
          {
            update_profiles_by_pk: [
              {
                _set: {
                  cosoul_mint_error: e.message,
                },
                pk_columns: {
                  id: p.id,
                },
              },
              {
                __typename: true,
              },
            ],
          },
          {
            operationName: 'cron_cosoulMinter__minted__error',
          }
        );
        console.error(
          'Error while minting cosoul for address: ',
          p.address,
          e.message
        );
      }
    }

    console.log('Minting complete', { success, errors });
    res.status(200).json({
      success: true,
      minted: profiles.length,
      errorsCount: errors,
      successCount: success,
    });
  } catch (e: any) {
    console.error('Error while minting cosouls', e);
    res.status(500).json({
      success: false,
      error: e.message,
    });
  }
}

export async function giversToMint(who: 'giver' | 'receiver') {
  // get all addresses that have colinks_give but not yet a cosoul
  const { profiles } = await adminClient.query(
    {
      profiles: [
        {
          where: {
            _not: { cosoul: {} },
            cosoul_mint_error: {
              _is_null: true,
            },
            ...(who === 'receiver'
              ? {
                  colinks_gives_received_aggregate: {
                    count: { predicate: { _gt: 0 } },
                  },
                }
              : {
                  colinks_gives_sent_aggregate: {
                    count: { predicate: { _gt: 0 } },
                  },
                }),
          },
          order_by: [{ created_at: order_by.desc }],
          limit: LIMIT,
        },
        { id: true, address: true },
      ],
    },
    { operationName: 'cron_cosoulMinter__getProfilesToMint' }
  );
  return profiles;
}

export default verifyHasuraRequestMiddleware(handler);
