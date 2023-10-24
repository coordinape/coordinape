import assert from 'assert';

import {
  key_holders_constraint,
  key_holders_update_column,
  key_tx_constraint,
  private_stream_visibility_constraint,
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
            share_amount: data.shareAmount,
            eth_amount: data.ethAmount,
            protocol_fee_amount: data.protocolEthAmount,
            subject_fee_amount: data.subjectEthAmount,
            supply: data.supply,
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

// update the key holders cache based on changes from these transactions, and also update the visibility table
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
  const holderPairs: { profile_id_a: number; profile_id_b: number }[] = [];

  const { insert_key_holders } = await adminClient.mutate(
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
          returning: {
            address_cosoul: {
              profile: {
                id: true,
              },
            },
            subject_cosoul: {
              profile: {
                id: true,
              },
            },
          },
        },
      ],
    },
    {
      operationName: 'update_keys_held',
    }
  );

  // get all the pairs of subject/address
  if (insert_key_holders?.returning) {
    for (const h of insert_key_holders.returning) {
      if (h?.address_cosoul?.profile?.id && h?.subject_cosoul?.profile?.id) {
        holderPairs.push({
          profile_id_a: h.address_cosoul.profile.id,
          profile_id_b: h.subject_cosoul.profile.id,
        });
      }
    }
  }

  await deleteFromKeysHolderCacheAndPrivateVisibility(deleteHolders);
  // for each holder_pair, make sure they have a private_stream_visibility row

  /*
  for each of the unique holders, update their private_stream_visibility table
   */
  // TODO: this private_stream stuff could be an event trigger
  await adminClient.mutate(
    {
      insert_private_stream_visibility: [
        {
          objects: [
            ...holderPairs.map(h => ({
              profile_id: h.profile_id_a,
              view_profile_id: h.profile_id_b,
            })),
            ...holderPairs.map(h => ({
              profile_id: h.profile_id_b,
              view_profile_id: h.profile_id_a,
            })),
          ],
          on_conflict: {
            constraint:
              private_stream_visibility_constraint.private_stream_visibility_pkey,
            update_columns: [],
          },
        },
        {
          __typename: true,
        },
      ],
    },
    {
      operationName: 'update_private_stream_visibility',
    }
  );
}

// For every deleted holder, delete their A<->S and S<->A private_stream_visibility rows if the other holder is not in the key_holders table
async function deleteFromKeysHolderCacheAndPrivateVisibility(
  deleteHolders: InsertOrUpdateHolder[]
) {
  for (const holder of deleteHolders) {
    const { delete_key_holders } = await adminClient.mutate(
      {
        delete_key_holders: [
          {
            where: {
              address: { _eq: holder.address },
              subject: { _eq: holder.subject },
            },
          },
          {
            returning: {
              address_cosoul: {
                profile: {
                  id: true,
                },
              },
              subject_cosoul: {
                key_holders: [
                  {
                    where: {
                      address: { _eq: holder.subject },
                      subject: { _eq: holder.address },
                    },
                  },
                  {
                    amount: true,
                  },
                ],
                profile: {
                  id: true,
                },
              },
            },
          },
        ],
      },
      {
        operationName: 'delete_keys_held',
      }
    );
    // get all the pairs of subject/address
    if (delete_key_holders?.returning) {
      for (const h of delete_key_holders.returning) {
        if (h?.address_cosoul?.profile?.id && h?.subject_cosoul?.profile?.id) {
          if (!h.subject_cosoul.key_holders?.length) {
            // ok delete both of these
            await adminClient.mutate(
              {
                delete_private_stream_visibility: [
                  {
                    where: {
                      _or: [
                        {
                          profile_id: { _eq: h.address_cosoul.profile.id },
                          view_profile_id: { _eq: h.subject_cosoul.profile.id },
                        },
                        {
                          profile_id: { _eq: h.subject_cosoul.profile.id },
                          view_profile_id: { _eq: h.address_cosoul.profile.id },
                        },
                      ],
                    },
                  },
                  {
                    __typename: true,
                  },
                ],
              },
              {
                operationName: 'delete_private_stream_visibility',
              }
            );
          }
        }
      }
    }
  }
}
