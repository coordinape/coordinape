import assert from 'assert';

import {
  link_holders_constraint,
  link_holders_update_column,
  link_tx_constraint,
  private_stream_visibility_constraint,
} from '../../../../api-lib/gql/__generated__/zeus';
import { adminClient } from '../../../../api-lib/gql/adminClient';

import { getCoLinksContract } from './colinks';
import { getLinkTxLogs, LinkTx, parseEventLog } from './getLinkTxLogs';

export const updateHoldersFromOneLog = async (rawLog: any) => {
  const coLinks = getCoLinksContract();
  assert(coLinks);
  const event = parseEventLog(coLinks, rawLog);

  // time this
  const start = new Date();
  await updateFromLinkTx(event, rawLog.transaction.hash);
  const end = new Date();
  // eslint-disable-next-line no-console
  console.log('updateFromLinkTx took: ', end.getTime() - start.getTime(), 'ms');
};

export const updateHoldersFromRecentBlocks = async (holder: string) => {
  const start = new Date();
  const logs = await getLinkTxLogs(holder);
  const end = new Date();
  // eslint-disable-next-line no-console
  console.log('getLinkTxLogs took: ', end.getTime() - start.getTime(), 'ms');

  // time this
  const start2 = new Date();
  for (const log of logs) {
    // console.log({ transactionHash: log.transactionHash });
    const { data, transactionHash } = log;
    await updateFromLinkTx(data, transactionHash);
  }
  const end2 = new Date();
  // eslint-disable-next-line no-console
  console.log(
    'recentBlocks.updateFromLinkTx took: ',
    end2.getTime() - start2.getTime(),
    'ms'
  );
};

const updateFromLinkTx = async (event: LinkTx, hash: string) => {
  // 1. insert the new tx !
  await insertLinkTx({
    data: event,
    transactionHash: hash,
  });

  // Now we know the total supply from the LinkTx but we don't know the holder->target balance
  // 2. get the balance of the holder->target
  const holderTargetBalance = await calculateLinkAmountFromTransactions(
    event.holder.toLowerCase(),
    event.target.toLowerCase()
  );

  const holderTarget = {
    amount: holderTargetBalance,
    holder: event.holder.toLowerCase(),
    target: event.target.toLowerCase(),
  };

  // console.log({ holderTarget });

  // 3. update the link_holders table and visibility
  const start = new Date();
  await updateLinkHoldersTable(holderTarget);
  const end = new Date();
  // eslint-disable-next-line no-console
  console.log(
    'updateLinkHoldersTableFromOneLog took: ',
    end.getTime() - start.getTime(),
    'ms'
  );
};

// this goes over every trade the address has ever done. could be more efficient
const calculateLinkAmountFromTransactions = async (
  holder: string,
  target: string
) => {
  const { link_tx } = await adminClient.query(
    {
      link_tx: [
        {
          where: {
            holder: {
              _eq: holder.toLowerCase(),
            },
            target: {
              _eq: target.toLowerCase(),
            },
          },
        },
        {
          buy: true,
          link_amount: true,
        },
      ],
    },
    {
      operationName: 'getLinksHeld',
    }
  );

  let balance = 0;
  for (const tx of link_tx) {
    if (tx.buy) {
      balance += Number(tx.link_amount);
    } else {
      balance -= Number(tx.link_amount);
    }
  }
  return balance;
};

async function insertLinkTx({
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

type LinkHolder = {
  holder: string;
  target: string;
  amount: number;
};
// update the link holders cache based on changes from these transactions, and also update the visibility table
async function updateLinkHoldersTable(holderTarget: LinkHolder) {
  // if they have an amount, update/insert
  if (holderTarget.amount > 0) {
    let updated = await updateHolder(holderTarget);
    if (!updated) {
      updated = await insertHolder(holderTarget);
    }
    const updatedProfileIds = await getProfileIds(holderTarget);
    if (updatedProfileIds) {
      await updateVisibilityForHolderPair(updatedProfileIds);
    }
  } else {
    // if they have no amount, clean up and delete
    await deleteFromLinkHolderCacheAndPrivateVisibility(holderTarget);
  }
}

const updateVisibilityForHolderPair = async (pair: [number, number]) => {
  // TODO: this private_stream stuff could be an event trigger
  // for the inserts, we also need to check if there is muting
  const { notMuted, muted } = await calculateMutedPairs(pair[0], pair[1]);

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
};

// take the holders and break them up into valid/visible holders with visibility of each other and holders that need muting
async function calculateMutedPairs(
  holder_profile_id: number,
  target_profile_id: number
) {
  const notMuted: { profile_id: number; view_profile_id: number }[] = [];
  const muted: { profile_id: number; view_profile_id: number }[] = [];

  const { holderMuted, targetMuted } = await adminClient.query(
    {
      __alias: {
        targetMuted: {
          mutes_by_pk: [
            {
              profile_id: holder_profile_id,
              target_profile_id: target_profile_id,
            },
            {
              profile_id: true,
            },
          ],
        },
        holderMuted: {
          mutes_by_pk: [
            {
              profile_id: target_profile_id,
              target_profile_id: holder_profile_id,
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
    profile_id: holder_profile_id,
    view_profile_id: target_profile_id,
  };

  if (targetMuted) {
    muted.push(holderViewTarget);
  } else {
    notMuted.push(holderViewTarget);
  }

  const targetViewHolder = {
    profile_id: target_profile_id,
    view_profile_id: holder_profile_id,
  };

  if (holderMuted) {
    muted.push(targetViewHolder);
  } else {
    notMuted.push(targetViewHolder);
  }
  return {
    muted,
    notMuted,
  };
}

// For every deleted holder, delete their A<->S and S<->A private_stream_visibility rows if the other holder is not in the link_holders table
// TODO: further optimization could take in the profileIds that we already have
async function deleteFromLinkHolderCacheAndPrivateVisibility(
  holder: LinkHolder
) {
  const { delete_link_holders } = await adminClient.mutate(
    {
      delete_link_holders: [
        {
          where: {
            holder: { _eq: holder.holder.toLowerCase() },
            target: { _eq: holder.target.toLowerCase() },
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
              held_links: [
                {
                  where: {
                    holder: { _eq: holder.target.toLowerCase() },
                    target: { _eq: holder.holder.toLowerCase() },
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
  console.log('DELETO', delete_link_holders);
  // get all the pairs of subject/address
  if (delete_link_holders?.returning) {
    for (const h of delete_link_holders.returning) {
      // delete the visibility when they don't own each others links
      if (h?.holder_cosoul?.profile?.id && h?.target_cosoul?.profile?.id) {
        console.log({ holders: h.target_cosoul.held_links });
        if (!h.target_cosoul.held_links?.length) {
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

const updateHolder = async (holderPair: LinkHolder) => {
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

const insertHolder = async (holder: LinkHolder) => {
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
          __typename: true,
        },
      ],
    },
    {
      operationName: 'insert_link_held',
    }
  );
  return !!insert_link_holders_one;
};

const getProfileIds = async (
  userA: LinkHolder
): Promise<[number, number] | undefined> => {
  const { holder_profile, target_profile } = await adminClient.query(
    {
      __alias: {
        holder_profile: {
          profiles: [
            {
              where: {
                address: { _eq: userA.holder.toLowerCase() },
              },
              limit: 1,
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
                address: { _eq: userA.target.toLowerCase() },
              },
              limit: 1,
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

  const tp = target_profile.pop();
  const hp = holder_profile.pop();
  if (hp?.id && tp?.id) {
    return [hp.id, tp.id];
  }
  return undefined;
};
