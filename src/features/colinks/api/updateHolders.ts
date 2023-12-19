import assert from 'assert';

import {
  link_holders_constraint,
  link_holders_update_column,
  link_tx_constraint,
  private_stream_visibility_constraint,
  ValueTypes,
} from '../../../../api-lib/gql/__generated__/zeus';
import { adminClient } from '../../../../api-lib/gql/adminClient';

import { getCoLinksContract } from './colinks';
import { getLinkTxLogs, LinkTx, parseEventLog } from './getLinkTxLogs';

export const updateHoldersFromOneLog = async (rawLog: any) => {
  const coLinks = getCoLinksContract();
  assert(coLinks);
  const event = parseEventLog(coLinks, rawLog);

  // eslint-disable-next-line no-console
  console.log({ event });

  await insertTradeEvent({
    data: event,
    transactionHash: rawLog.transaction.hash,
  });

  const holdersToUpdate: InsertOrUpdateHolder[] = [];
  holdersToUpdate.push(...(await getLinksHeld(event.holder)));
  holdersToUpdate.push(...(await getLinkHolders(event.target)));
  await updateLinkHoldersTable(holdersToUpdate);
};

export const updateHoldersFromRecentBlocks = async () => {
  const start = new Date();
  const logs = await getLinkTxLogs();
  const end = new Date();
  // eslint-disable-next-line no-console
  console.log('getLinkTxLogs took: ', end.getTime() - start.getTime(), 'ms');
  const subjectsToUpdate = new Set<string>();
  const addressesToUpdate = new Set<string>();

  for (const log of logs) {
    const { data } = log;
    subjectsToUpdate.add(data.target.toLowerCase());
    addressesToUpdate.add(data.holder.toLowerCase());

    await insertTradeEvent(log);
  }

  const holdersToUpdate: InsertOrUpdateHolder[] = [];
  for (const address of addressesToUpdate) {
    holdersToUpdate.push(...(await getLinksHeld(address)));
  }

  for (const subject of subjectsToUpdate) {
    holdersToUpdate.push(...(await getLinkHolders(subject)));
  }

  await updateLinkHoldersTable(holdersToUpdate);
};

type InsertOrUpdateHolder = Pick<
  Required<ValueTypes['link_holders_insert_input']>,
  'holder' | 'target' | 'amount'
> & { amount: number; target: string; holder: string };

// this goes over every trade the address has ever done. could be more efficient
const getLinksHeld = async (holder: string) => {
  const { link_tx } = await adminClient.query(
    {
      link_tx: [
        {
          where: {
            holder: {
              _eq: holder.toLowerCase(),
            },
          },
        },
        {
          target: true,
          buy: true,
          link_amount: true,
        },
      ],
    },
    {
      operationName: 'getLinksHeld',
    }
  );

  const linksHeld = new Map<string, InsertOrUpdateHolder>();
  for (const tx of link_tx) {
    const link = linksHeld.get(tx.target) ?? {
      holder,
      target: tx.target,
      amount: 0,
    };
    if (tx.buy) {
      link.amount++;
    } else {
      link.amount--;
    }
    linksHeld.set(tx.target, link);
  }
  return Array.from(linksHeld.values());
};

const getLinkHolders = async (target: string) => {
  const { link_tx } = await adminClient.query(
    {
      link_tx: [
        {
          where: {
            target: {
              _eq: target.toLowerCase(),
            },
          },
        },
        {
          holder: true,
          buy: true,
          link_amount: true,
        },
      ],
    },
    {
      operationName: 'getLinkHolders',
    }
  );

  const linkHolders = new Map<string, InsertOrUpdateHolder>();
  for (const tx of link_tx) {
    const link = linkHolders.get(tx.holder) ?? {
      holder: tx.holder,
      target: target,
      amount: 0,
    };
    if (tx.buy) {
      link.amount++;
    } else {
      link.amount--;
    }
    linkHolders.set(tx.holder, link);
  }
  return Array.from(linkHolders.values());
};

async function insertTradeEvent({
  data,
  transactionHash,
}: {
  data: LinkTx;
  transactionHash: string;
}) {
  await adminClient.mutate(
    {
      insert_link_tx_one: [
        {
          object: {
            tx_hash: transactionHash.toLowerCase(),
            holder: data.holder.toLowerCase(),
            target: data.target.toLowerCase(),
            buy: data.isBuy,
            link_amount: data.linkAmount.toString(),
            eth_amount: data.ethAmount.toString(),
            protocol_fee_amount: data.protocolEthAmount.toString(),
            target_fee_amount: data.targetEthAmount.toString(),
            supply: data.supply.toString(),
          },
          on_conflict: {
            constraint: link_tx_constraint.key_tx_pkey,
            update_columns: [], // ignore if we already got it
          },
        },
        {
          __typename: true,
        },
      ],
    },
    {
      operationName: 'syncLinks__insert_link_tx_one',
    }
  );
}

// update the link holders cache based on changes from these transactions, and also update the visibility table
async function updateLinkHoldersTable(holdersToUpdate: InsertOrUpdateHolder[]) {
  // eliminate duplicates where subject and address are the same so we don't update the same row twice
  const seen = new Set<string>();
  const uniqueHolders = holdersToUpdate.filter(holder => {
    const link = `${holder.target.toLowerCase()}-${holder.holder.toLowerCase()}`;
    if (seen.has(link)) {
      return false;
    }
    seen.add(link);
    return true;
  });

  const deleteHolders: InsertOrUpdateHolder[] = uniqueHolders.filter(
    holder => holder.amount === 0
  );

  const insertHolders = uniqueHolders.filter(holder => holder.amount !== 0);

  const holderPairs: {
    holder_profile_id: number;
    target_profile_id: number;
  }[] = [];

  // time this block of code
  const start = new Date();
  for (const holder of insertHolders) {
    let updated = await updateHolder(holder);

    if (!updated) {
      updated = await insertHolder(holder);
    }

    // get all the pairs of subject/address
    if (updated) {
      const { holder_profile, target_profile } = await adminClient.query(
        {
          __alias: {
            holder_profile: {
              profiles: [
                {
                  where: {
                    address: { _eq: holder.holder.toLowerCase() },
                  },
                },
                {
                  id: true,
                },
              ],
            },
            target_profile: {
              profiles: [
                {
                  where: {
                    address: { _eq: holder.target.toLowerCase() },
                  },
                },
                {
                  id: true,
                },
              ],
            },
          },
        },
        {
          operationName: 'updateHolders_getProfileIds',
        }
      );

      const hp = holder_profile.pop();
      const tp = target_profile.pop();
      if (hp?.id && tp?.id) {
        holderPairs.push({
          holder_profile_id: hp.id,
          target_profile_id: tp.id,
        });
      }
    }
  }

  const end = new Date();
  // eslint-disable-next-line no-console
  console.log('update_link_held took: ', end.getTime() - start.getTime(), 'ms');

  await deleteFromLinkHolderCacheAndPrivateVisibility(deleteHolders);
  // for each holder_pair, make sure they have a private_stream_visibility row

  // TODO: this private_stream stuff could be an event trigger
  // for the inserts, we also need to check if there is muting
  const { notMuted, muted } = await calculateMutedPairs(holderPairs);

  // insert visibility for all the non-muted pairs
  await adminClient.mutate(
    {
      insert_private_stream_visibility: [
        {
          objects: notMuted,
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
      operationName: 'updateHolders_update_private_stream_visibility',
    }
  );

  // Delete visibility for all the muted pairs
  await adminClient.mutate(
    {
      delete_private_stream_visibility: [
        {
          where: {
            _or: muted.map(m => ({
              profile_id: { _eq: m.profile_id },
              view_profile_id: { _eq: m.view_profile_id },
            })),
          },
        },
        {
          __typename: true,
        },
      ],
    },
    {
      operationName: 'updateHolders_delete_visibility',
    }
  );
}

// take the holders and break them up into valid/visible holders with visibility of each other and holders that need muting
async function calculateMutedPairs(
  holderPairs: {
    holder_profile_id: number;
    target_profile_id: number;
  }[] = []
) {
  const notMuted: { profile_id: number; view_profile_id: number }[] = [];
  const muted: { profile_id: number; view_profile_id: number }[] = [];

  for (const pair of holderPairs) {
    const { holderMuted, targetMuted } = await adminClient.query(
      {
        __alias: {
          targetMuted: {
            mutes_by_pk: [
              {
                profile_id: pair.holder_profile_id,
                target_profile_id: pair.target_profile_id,
              },
              {
                profile_id: true,
              },
            ],
          },
          holderMuted: {
            mutes_by_pk: [
              {
                profile_id: pair.target_profile_id,
                target_profile_id: pair.holder_profile_id,
              },
              {
                profile_id: true,
              },
            ],
          },
        },
      },
      {
        operationName: 'calculateMutedPairs',
      }
    );

    const holderViewTarget = {
      profile_id: pair.holder_profile_id,
      view_profile_id: pair.target_profile_id,
    };

    if (targetMuted) {
      muted.push(holderViewTarget);
    } else {
      notMuted.push(holderViewTarget);
    }

    const targetViewHolder = {
      profile_id: pair.target_profile_id,
      view_profile_id: pair.holder_profile_id,
    };

    if (holderMuted) {
      muted.push(targetViewHolder);
    } else {
      notMuted.push(targetViewHolder);
    }
  }
  return {
    muted,
    notMuted,
  };
}

// For every deleted holder, delete their A<->S and S<->A private_stream_visibility rows if the other holder is not in the link_holders table
async function deleteFromLinkHolderCacheAndPrivateVisibility(
  deleteHolders: InsertOrUpdateHolder[]
) {
  for (const holder of deleteHolders) {
    const { delete_link_holders } = await adminClient.mutate(
      {
        delete_link_holders: [
          {
            where: {
              holder: { _eq: holder.holder },
              target: { _eq: holder.target },
            },
          },
          {
            returning: {
              holder_cosoul: {
                profile: {
                  id: true,
                },
              },
              target_cosoul: {
                link_holders: [
                  {
                    where: {
                      holder: { _eq: holder.target },
                      target: { _eq: holder.holder },
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
        operationName: 'delete_links_held',
      }
    );
    // get all the pairs of subject/address
    if (delete_link_holders?.returning) {
      for (const h of delete_link_holders.returning) {
        // delete the visibility when they don't own each others links
        if (h?.holder_cosoul?.profile?.id && h?.target_cosoul?.profile?.id) {
          if (!h.target_cosoul.link_holders?.length) {
            // ok delete both of these
            await adminClient.mutate(
              {
                delete_private_stream_visibility: [
                  {
                    where: {
                      _or: [
                        {
                          profile_id: { _eq: h.holder_cosoul.profile.id },
                          view_profile_id: { _eq: h.target_cosoul.profile.id },
                        },
                        {
                          profile_id: { _eq: h.target_cosoul.profile.id },
                          view_profile_id: { _eq: h.holder_cosoul.profile.id },
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

const updateHolder = async (holderPair: InsertOrUpdateHolder) => {
  const { update_link_holders } = await adminClient.mutate(
    {
      update_link_holders: [
        {
          where: {
            holder: { _eq: holderPair.holder.toLowerCase() },
            target: { _eq: holderPair.target.toLowerCase() },
          },
          _set: {
            amount: holderPair.amount,
          },
        },
        {
          affected_rows: true,
        },
      ],
    },
    {
      operationName: 'update_link_held',
    }
  );
  if (!update_link_holders || update_link_holders.affected_rows === 0) {
    return false;
  }
  return true;
};

const insertHolder = async (holder: InsertOrUpdateHolder) => {
  const { insert_link_holders_one } = await adminClient.mutate(
    {
      insert_link_holders_one: [
        {
          object: holder,
          on_conflict: {
            constraint: link_holders_constraint.key_holders_pkey,
            update_columns: [link_holders_update_column.amount],
          },
        },
        {
          holder_cosoul: {
            profile: {
              id: true,
            },
          },
          target_cosoul: {
            profile: {
              id: true,
            },
          },
        },
      ],
    },
    {
      operationName: 'insert_link_held',
    }
  );
  return !!insert_link_holders_one;
};
