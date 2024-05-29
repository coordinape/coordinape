/* eslint-disable no-console */
import { EAS, SchemaEncoder } from '@ethereum-attestation-service/eas-sdk';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Wallet } from 'ethers';

import { COSOUL_SIGNER_ADDR_PK } from '../../../api-lib/config';
import { order_by } from '../../../api-lib/gql/__generated__/zeus';
import { adminClient } from '../../../api-lib/gql/adminClient';
import { getProvider } from '../../../api-lib/provider';
import { verifyHasuraRequestMiddleware } from '../../../api-lib/validate';

const LIMIT = 9;
const BASE_EAS_CONTRACT_ADDR = '0x4200000000000000000000000000000000000021';

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
        const attestUid = await attestGiveOnchain(give);

        console.log(
          'Success: attested give for give.id : ',
          give.id,
          ' receiver address: ',
          give.target_profile_public?.address
        );

        await adminClient.mutate(
          {
            update_colinks_gives_by_pk: [
              {
                _set: {
                  tx_hash: attestUid, // todo: rename to attest uid or use tx_hash instead
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

async function giveToSync() {
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

type Give = Awaited<ReturnType<typeof giveToSync>>[number];

async function attestGiveOnchain(give: Give) {
  // connect to Base EAS
  const chainId = 8453;
  const provider = getProvider(chainId);

  const syncerWallet = new Wallet(COSOUL_SIGNER_ADDR_PK);
  const signer = syncerWallet.connect(provider);

  const eas = new EAS(BASE_EAS_CONTRACT_ADDR);
  // @ts-ignore
  eas.connect(signer);

  const schemaUID =
    '0x0be4dce014ddd797912a70917bae820b54d4de03ee134b6b66cd80cd15793c6a';
  // Initialize SchemaEncoder with the schema string
  const schemaEncoder = new SchemaEncoder(
    'address giver,string skill,string cast_hash'
  );
  const encodedData = schemaEncoder.encodeData([
    {
      name: 'giver',
      value: '0x0000000000000000000000000000000000000000',
      type: 'address',
    },
    { name: 'skill', value: '', type: 'string' },
    { name: 'cast_hash', value: '', type: 'string' },
  ]);

  const tx = await eas.attest({
    schema: schemaUID,
    data: {
      recipient: give.target_profile_public?.address ?? '',
      expirationTime: BigInt(0),
      revocable: true,
      data: encodedData,
    },
  });

  const newAttestationUID = await tx.wait();

  return newAttestationUID;
}

export default verifyHasuraRequestMiddleware(handler);
