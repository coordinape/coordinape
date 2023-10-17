import type { VercelRequest, VercelResponse } from '@vercel/node';
import { ethers } from 'ethers';

import {
  key_holders_constraint,
  key_holders_update_column,
  key_tx_constraint,
  ValueTypes,
} from '../../../../api-lib/gql/__generated__/zeus';
import { adminClient } from '../../../../api-lib/gql/adminClient';
import { getInput } from '../../../../api-lib/handlerHelpers';
import { errorResponse } from '../../../../api-lib/HttpError';
import { getProvider } from '../../../../api-lib/provider';
import { chain } from '../../../../src/features/cosoul/chains';
import { getSoulKeysContract } from '../../../../src/features/soulkeys/api/soulkeys';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    await getInput(req);

    const provider = getProvider(Number(chain.chainId));

    const soulKeys = getSoulKeysContract();
    const tradeSig =
      'Trade(address,address,bool,uint256,uint256,uint256,uint256,uint256)';
    const tradeTopic: string = ethers.utils.id(tradeSig);

    // Get 10 blocks worth of key transactions and put them all in the db
    const currentBlock = await provider.getBlockNumber();
    const rawLogs = await provider.getLogs({
      address: soulKeys.address,
      topics: [tradeTopic],
      fromBlock: currentBlock - 10,
      toBlock: currentBlock,
    });

    const subjectsToUpdate = new Set<string>();
    const addressesToUpdate = new Set<string>();

    for (const log of rawLogs) {
      console.log(log);
      const trade = soulKeys.interface.decodeEventLog(tradeSig, log.data);

      const {
        trader,
        subject,
        isBuy,
        shareAmount,
        ethAmount,
        protocolEthAmount,
        subjectEthAmount,
        supply,
      } = trade;

      subjectsToUpdate.add(subject.toLowerCase());
      addressesToUpdate.add(trader.toLowerCase());

      await adminClient.mutate(
        {
          insert_key_tx_one: [
            {
              object: {
                tx_hash: log.transactionHash.toLowerCase(),
                trader: trader.toLowerCase(),
                subject: subject.toLowerCase(),
                buy: isBuy,
                share_amount: shareAmount.toNumber(),
                eth_amount: ethAmount.toNumber(),
                protocol_fee_amount: protocolEthAmount.toNumber(),
                subject_fee_amount: subjectEthAmount.toNumber(),
                supply: supply.toNumber(),
              },
              on_conflict: {
                constraint: key_tx_constraint.key_tx_pkey,
                update_columns: [], // ignore if we already got it
              },
            },
            {
              __typename: true,
            },
          ],
        },
        {
          operationName: 'syncKeys__insert_key_tx_one',
        }
      );
    }

    const holdersToUpdate: InsertOrUpdateHolder[] = [];
    for (const address of addressesToUpdate) {
      holdersToUpdate.push(...(await getKeysHeld(address)));
    }

    for (const subject of subjectsToUpdate) {
      holdersToUpdate.push(...(await getKeyHolders(subject)));
    }

    // in holdersToUpdate, eliminate duplicates where subject and address are the same
    const seen = new Set<string>();
    const uniqueHolders = holdersToUpdate.filter(holder => {
      const key = `${holder.subject}-${holder.address}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });

    await adminClient.mutate(
      {
        insert_key_holders: [
          {
            objects: uniqueHolders,
            on_conflict: {
              constraint: key_holders_constraint.key_holders_pkey,
              update_columns: [key_holders_update_column.amount],
            },
          },
          {
            __typename: true,
          },
        ],
      },
      {
        operationName: 'update_keys_held',
      }
    );
    return res.status(200).json({ success: true });
  } catch (e: any) {
    return errorResponse(res, e);
  }
}

type InsertOrUpdateHolder = Pick<
  Required<ValueTypes['key_holders_insert_input']>,
  'address' | 'subject' | 'amount'
> & { amount: number };

// this goes over ever trade the address has ever done. could me more efficient
const getKeysHeld = async (address: string) => {
  const { key_tx } = await adminClient.query(
    {
      key_tx: [
        {
          where: {
            trader: {
              _eq: address.toLowerCase(),
            },
          },
        },
        {
          subject: true,
          buy: true,
          share_amount: true,
        },
      ],
    },
    {
      operationName: 'getKeysHeld',
    }
  );

  const keysHeld = new Map<string, InsertOrUpdateHolder>();
  for (const tx of key_tx) {
    const key = keysHeld.get(tx.subject) ?? {
      address: address,
      subject: tx.subject,
      amount: 0,
    };
    if (tx.buy) {
      key.amount++;
    } else {
      key.amount--;
    }
    keysHeld.set(tx.subject, key);
  }
  return Array.from(keysHeld.values());
};

const getKeyHolders = async (subject: string) => {
  const { key_tx } = await adminClient.query(
    {
      key_tx: [
        {
          where: {
            subject: {
              _eq: subject.toLowerCase(),
            },
          },
        },
        {
          trader: true,
          buy: true,
          share_amount: true,
        },
      ],
    },
    {
      operationName: 'getKeyHolders',
    }
  );

  const keyHolders = new Map<string, InsertOrUpdateHolder>();
  for (const tx of key_tx) {
    const key = keyHolders.get(tx.trader) ?? {
      address: tx.trader,
      subject: subject,
      amount: 0,
    };
    if (tx.buy) {
      key.amount++;
    } else {
      key.amount--;
    }
    keyHolders.set(tx.trader, key);
  }
  return Array.from(keyHolders.values());
};
