import assert from 'assert';

import {
  key_holders_constraint,
  key_holders_update_column,
  key_tx_constraint,
  ValueTypes,
} from '../../../../api-lib/gql/__generated__/zeus';
import { adminClient } from '../../../../api-lib/gql/adminClient';

import { getTradeLogs, parseEventLog, TradeEvent } from './getTradeLogs';
import { getSoulKeysContract } from './soulkeys';

export const updateHoldersFromOneLog = async (rawLog: any) => {
  const soulKeys = getSoulKeysContract();
  assert(soulKeys);
  const event = parseEventLog(soulKeys, rawLog);

  // eslint-disable-next-line no-console
  console.log({ event });

  await insertTradeEvent({
    data: event,
    transactionHash: rawLog.transaction.hash,
  });

  const holdersToUpdate: InsertOrUpdateHolder[] = [];
  holdersToUpdate.push(...(await getKeysHeld(event.trader)));
  holdersToUpdate.push(...(await getKeyHolders(event.subject)));
  await updateKeyHoldersTable(holdersToUpdate);
};

export const updateHoldersFromRecentBlocks = async () => {
  const logs = await getTradeLogs();
  const subjectsToUpdate = new Set<string>();
  const addressesToUpdate = new Set<string>();

  for (const log of logs) {
    const { data } = log;
    subjectsToUpdate.add(data.subject.toLowerCase());
    addressesToUpdate.add(data.trader.toLowerCase());

    await insertTradeEvent(log);
  }

  const holdersToUpdate: InsertOrUpdateHolder[] = [];
  for (const address of addressesToUpdate) {
    holdersToUpdate.push(...(await getKeysHeld(address)));
  }

  for (const subject of subjectsToUpdate) {
    holdersToUpdate.push(...(await getKeyHolders(subject)));
  }

  await updateKeyHoldersTable(holdersToUpdate);
};

type InsertOrUpdateHolder = Pick<
  Required<ValueTypes['key_holders_insert_input']>,
  'address' | 'subject' | 'amount'
> & { amount: number; subject: string; address: string };

// this goes over every trade the address has ever done. could be more efficient
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

async function insertTradeEvent({
  data,
  transactionHash,
}: {
  data: TradeEvent;
  transactionHash: string;
}) {
  await adminClient.mutate(
    {
      insert_key_tx_one: [
        {
          object: {
            tx_hash: transactionHash.toLowerCase(),
            trader: data.trader.toLowerCase(),
            subject: data.subject.toLowerCase(),
            buy: data.isBuy,
            share_amount: data.shareAmount.toNumber(),
            eth_amount: data.ethAmount.toNumber(),
            protocol_fee_amount: data.protocolEthAmount.toNumber(),
            subject_fee_amount: data.subjectEthAmount.toNumber(),
            supply: data.supply.toNumber(),
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

async function updateKeyHoldersTable(holdersToUpdate: InsertOrUpdateHolder[]) {
  // eliminate duplicates where subject and address are the same so we don't update the same row twice
  const seen = new Set<string>();
  const uniqueHolders = holdersToUpdate.filter(holder => {
    const key = `${holder.subject.toLowerCase()}-${holder.address.toLowerCase()}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });

  const deleteHolders: InsertOrUpdateHolder[] = uniqueHolders.filter(
    holder => holder.amount === 0
  );

  const insertHolders = uniqueHolders.filter(holder => holder.amount !== 0);
  console.log('======>DELETE', deleteHolders);
  console.log('======>INSERT', insertHolders);
  await adminClient.mutate(
    {
      insert_key_holders: [
        {
          objects: insertHolders,
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

  for (const holder of deleteHolders) {
    await adminClient.mutate(
      {
        delete_key_holders: [
          {
            where: {
              address: { _eq: holder.address },
              subject: { _eq: holder.subject },
            },
          },
          {
            __typename: true,
          },
        ],
      },
      {
        operationName: 'delete_keys_held',
      }
    );
  }
}
