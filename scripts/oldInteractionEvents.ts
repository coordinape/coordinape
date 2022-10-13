/* eslint-disable @typescript-eslint/no-unused-vars,no-console */

import assert from 'assert';

import { BigNumber } from '@ethersproject/bignumber';
import { InfuraProvider } from '@ethersproject/providers';
import { formatUnits } from 'ethers/lib/utils';
import round from 'lodash/round';

import { adminClient } from '../api-lib/gql/adminClient';
import { Contracts, hasSimpleToken } from '../src/lib/vaults';

const provider = new InfuraProvider('homestead', process.env.INFURA_PROJECT_ID);
const contracts = new Contracts(1, provider, true);

type Awaited<T> = T extends PromiseLike<infer U> ? U : T;

const getDistributions = () =>
  adminClient.query({
    distributions: [
      {
        where: {
          tx_hash: { _is_null: false },
          vault: {
            chain_id: { _eq: 1 },
          },
        },
      },
      {
        id: true,
        created_at: true,
        created_by: true,
        tx_hash: true,
        distribution_json: [{}, true],
        epoch: {
          circle_id: true,
        },
        vault: {
          id: true,
          vault_address: true,
          token_address: true,
          simple_token_address: true,
          decimals: true,
          symbol: true,
        },
      },
    ],
  });

const handleDist = async (
  dist: Awaited<ReturnType<typeof getDistributions>>['distributions'][0]
) => {
  const {
    id,
    tx_hash,
    created_at,
    created_by,
    vault,
    vault: { decimals, vault_address: va, simple_token_address: sta },
    epoch: { circle_id },
    distribution_json: { tokenTotal, previousTotal },
  } = dist;

  const { interaction_events } = await adminClient.query({
    interaction_events: [
      {
        where: {
          event_type: { _eq: 'vault_distribution' },
          data: {
            _contains: { distribution_id: id },
          },
        },
      },
      { id: true, data: [{}, true] },
    ],
  });
  const ie = interaction_events[0];
  console.log(`dist ${id} has event: ${ie?.id}`);

  assert(tx_hash);
  const tx = await provider.getTransaction(tx_hash);
  assert(tx, `no tx for ${tx_hash}`);

  const simple = hasSimpleToken({ simple_token_address: sta });
  let amount = Number(
    formatUnits(BigNumber.from(tokenTotal).sub(previousTotal || '0'), decimals)
  );
  if (!simple) {
    const pps = await contracts.getPricePerShare(va, sta, decimals);
    amount = round(amount * pps.toUnsafeFloat(), 2);
  }
  const symbol = simple ? vault.symbol : `Yearn ${vault.symbol}`;

  const newEvent = {
    profile_id: created_by,
    event_type: 'vault_distribution',
    created_at,
    data: {
      amount,
      symbol,
      tx_hash,
      distribution_id: id,
      vault_id: vault.id,
      circle_id,
    },
  };

  if (ie) {
    console.log(
      'comparing:',
      amount,
      symbol,
      'vs.',
      ie.data.amount,
      ie.data.symbol
    );
    return;
  }

  return newEvent;
};

async function fixDistributions() {
  const { distributions } = await getDistributions();

  const inputs = (
    await Promise.all(
      distributions.map(async d => {
        try {
          process.stdout.write('.');
          return await handleDist(d);
        } catch (e) {
          console.error(e);
        }
      })
    )
  ).filter(x => x);

  console.log('\n' + JSON.stringify(inputs, null, 2));
  console.log(inputs.length);
}

// fixDistributions();

async function fixDeposits() {
  const { vaults } = await adminClient.query({
    vaults: [
      { where: { chain_id: { _eq: 1 } } },
      {
        id: true,
        vault_address: true,
        token_address: true,
        simple_token_address: true,
        symbol: true,
        decimals: true,
        deployment_block: true,
        created_by: true,
        organization: {
          id: true,
          name: true,
        },
      },
    ],
  });

  console.log(`${vaults.length} vaults`);

  for (const v of vaults) {
    const simple = hasSimpleToken(v);
    const symbol = simple ? v.symbol : `Yearn ${v.symbol}`;
    console.log(
      `\nvault ${v.id}: ${v.vault_address}, ${symbol}, ${v.organization.name}`
    );

    // find deposit events

    const token = contracts.getERC20(
      simple ? v.simple_token_address : v.token_address
    );
    const events = simple
      ? await token.queryFilter(
          token.filters.Transfer(null, v.vault_address),
          v.deployment_block
        )
      : await contracts.router.queryFilter(
          contracts.router.filters.DepositInVault(v.vault_address),
          v.deployment_block
        );

    console.log(`${events.length} deposit event(s)`);
    for (const e of events) {
      // calculate amount
      let transferEvent;
      if (simple) {
        transferEvent = e;
      } else {
        // find the transfer event from the vault owner to the router.
        // we want this because it has the exact amount of unwrapped tokens.
        transferEvent = (
          await token.queryFilter(
            token.filters.Transfer(null, contracts.router.address),
            e.blockNumber,
            e.blockNumber
          )
        )[0];
        assert(transferEvent.transactionHash === e.transactionHash);
      }
      const amount = Number(
        formatUnits((transferEvent.args as any).value, v.decimals)
      );
      console.log(amount, v.symbol);

      // see if a matching interaction_event exists

      const { interaction_events } = await adminClient.query({
        interaction_events: [
          {
            where: {
              profile_id: { _eq: v.created_by },
              event_type: { _eq: 'vault_deposit' },
            },
          },
          { id: true, org_id: true, data: [{}, true] },
        ],
      });
      const matches = interaction_events.filter(
        ie => ie.data.tx_hash === e.transactionHash
      );

      const object = {
        event_type: 'vault_deposit',
        profile_id: v.created_by,
        org_id: v.organization.id,
        data: {
          amount,
          symbol,
          tx_hash: e.transactionHash,
          vault_id: v.id,
        },
      };

      if (matches.length === 0) {
        console.log('no matches');

        // dry-run first
        const resp = await adminClient.mutate({
          insert_interaction_events_one: [{ object }, { id: true }],
        });
        console.log('inserted', resp.insert_interaction_events_one?.id, object);
      } else {
        assert(matches.length < 2);
        const { id: matchId, org_id, data } = matches[0];
        // sanity-check
        assert(Math.abs(data.amount - amount) < 0.1);
        assert(data.symbol === symbol);

        if (!data.vault_id || !org_id) {
          console.log('match is missing vault id and/or org_id');
          const resp = await adminClient.mutate({
            update_interaction_events_by_pk: [
              { pk_columns: { id: matchId }, _set: object },
              { id: true },
            ],
          });
          console.log(
            'updated',
            resp.update_interaction_events_by_pk?.id,
            object
          );
        } else {
          console.log('match checks out');
        }
      }
    }
  }
}

fixDeposits();

/*
deposit event:
ids inserted for deposits: 
 - 9924 -> 9937, inclusive
 - 9940 & 9941 (Zemm's deposits for Core, somehow missed)

quick view of Retool shows that deposits are still missing...
will have to crawl through the full list of vaults

distribution events: 10252 -> 10259
*/
