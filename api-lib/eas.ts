import { EAS, SchemaEncoder } from '@ethereum-attestation-service/eas-sdk';
import { NonceManager } from '@ethersproject/experimental';
import { Wallet } from 'ethers';
import { getAddress } from 'ethers/lib/utils';

import { Give } from '../_api/hasura/cron/giveOnchainSyncer';
import { ICEBREAKER_BEARER_TOKEN, IN_PRODUCTION } from '../src/config/env';
import { webAppURL } from '../src/config/webAppURL';
import { baseChain } from '../src/features/cosoul/chains';
import { coLinksPaths } from '../src/routes/paths';

import { COSOUL_SIGNER_ADDR_PK } from './config';
import { adminClient } from './gql/adminClient';
import { getProvider } from './provider';

const EAS_CONTRACT_ADDR = '0x4200000000000000000000000000000000000021';
const SCHEMA_UID =
  '0x82c2ec8ec89cf1d13022ff0867744f1cecf932faa4fe334aa1bb443edbfee3fa';
const SCHEMA =
  'address from,uint16 amount,string platform,string url,string context,string skill,string tag,string note,uint16 weight';

const ICEBREAKER_WORKED_WITH = 'worked-with';

export function easWithNonceManager() {
  const chainId = Number(baseChain.chainId);
  const provider = getProvider(chainId);

  const syncerWallet = new Wallet(COSOUL_SIGNER_ADDR_PK);

  const signer = new NonceManager(syncerWallet.connect(provider));
  const eas = new EAS(EAS_CONTRACT_ADDR);

  eas.connect(signer);
  return eas;
}

function setupEas() {
  const chainId = Number(baseChain.chainId);
  const provider = getProvider(chainId);

  const syncerWallet = new Wallet(COSOUL_SIGNER_ADDR_PK);
  const signer = syncerWallet.connect(provider);
  const eas = new EAS(EAS_CONTRACT_ADDR);

  eas.connect(signer);
  return eas;
}

export async function attestGiveOnchain(give: Give, eas = setupEas()) {
  try {
    // eslint-disable-next-line no-console
    console.log('Writing give onchain for give id: ', give.id);

    const receiverAddr = getAddress(give.target_profile_public?.address ?? '');
    const giverAddr = getAddress(give.giver_profile_public?.address ?? '');
    const platform = give.warpcast_url ? 'farcaster' : 'colinks';
    const context = give.warpcast_url ? 'give.party' : '';
    const url =
      (give.cast_hash
        ? give.warpcast_url
        : webAppURL('colinks') + coLinksPaths.post(give.activity_id)) || '';

    const schemaEncoder = new SchemaEncoder(SCHEMA);
    const data = [
      {
        name: 'from',
        value: giverAddr,
        type: 'address',
      },
      { name: 'amount', value: 1, type: 'uint16' },
      { name: 'platform', value: platform, type: 'string' },
      { name: 'url', value: url, type: 'string' },
      { name: 'context', value: context, type: 'string' },
      { name: 'skill', value: give.skill || '', type: 'string' },
      { name: 'tag', value: '', type: 'string' },
      { name: 'note', value: '', type: 'string' },
      { name: 'weight', value: '1', type: 'uint16' },
    ];
    const encodedData = schemaEncoder.encodeData(data);

    const tx = await eas.attest(
      {
        schema: SCHEMA_UID,
        data: {
          recipient: receiverAddr,
          expirationTime: 0,
          revocable: true,
          data: encodedData,
        },
      },
      {
        maxFeePerGas: baseChain.gasSettings.maxFeePerGas,
        maxPriorityFeePerGas: baseChain.gasSettings.maxPriorityFeePerGas,
      }
    );

    const attestUid = await tx.wait();

    // eslint-disable-next-line no-console
    console.log(
      'Attested give for give.id: ',
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
              tx_hash: tx.tx.hash,
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

    if (IN_PRODUCTION && give.skill && give.skill == ICEBREAKER_WORKED_WITH) {
      const json = {
        attesterAddress: giverAddr,
        attesteeAddress: receiverAddr,
        isPublic: true,
        name: 'Worked directly with',
        schemaID: 'colinks:endorsement:workedDirectlyWith',
        source: 'EAS',
        chain: 'base',
        reference: attestUid,
        timestamp: give.created_at,
        uid: attestUid,
      };

      try {
        // don't do this in local/stg

        // eslint-disable-next-line no-console
        console.log('Posting to icebreaker', { json });

        const response = await fetch(
          `https://app.icebreaker.xyz/api/v1/credentials`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${ICEBREAKER_BEARER_TOKEN}`,
            },
            body: JSON.stringify(json),
          }
        );

        if (response.status !== 200) {
          console.error(
            'Request failed to post to icebreaker',
            response.status,
            response.statusText
          );
        }
      } catch (err) {
        console.error('Error in posting to Icebreaker', err);
      }
    }

    return attestUid;
  } catch (e: any) {
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
      'Error writing give onchain for give id: ',
      give.id,
      e.message,
      e.stack
    );
    throw e;
  }
}
