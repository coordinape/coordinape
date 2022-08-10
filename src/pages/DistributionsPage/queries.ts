import assert from 'assert';

import { order_by } from 'lib/gql/__generated__/zeus';
import { client } from 'lib/gql/client';
import type { Contracts } from 'lib/vaults';

import type { Awaited } from 'types/shim';

export const getEpochData = async (
  epochId: number,
  myAddress?: string,
  contracts?: Contracts
) => {
  assert(contracts && myAddress);

  const gq = await client.query(
    {
      epochs_by_pk: [
        { id: epochId },
        {
          id: true,
          number: true,
          ended: true,
          start_date: true,
          end_date: true,
          circle: {
            id: true,
            name: true,
            fixed_payment_token_type: true,
            token_name: true,
            // get this user's role so we can check that they're an admin
            users: [
              { where: { address: { _eq: myAddress.toLowerCase() } } },
              { role: true },
            ],
            organization: {
              name: true,
              vaults: [
                {},
                {
                  id: true,
                  symbol: true,
                  decimals: true,
                  vault_address: true,
                  simple_token_address: true,
                },
              ],
            },
          },
          token_gifts: [
            { where: { tokens: { _gt: 0 } } },
            {
              recipient_address: true,
              recipient_id: true,
              recipient: {
                id: true,
                name: true,
                address: true,
                profile: {
                  avatar: true,
                  id: true,
                },
              },
              tokens: true,
            },
          ],
          distributions: [
            {
              where: { tx_hash: { _is_null: false } },
            },
            {
              created_at: true,
              total_amount: true,
              tx_hash: true,
              distribution_type: true,
              gift_amount: true,
              fixed_amount: true,
              vault: {
                id: true,
                decimals: true,
                symbol: true,
                vault_address: true,
                simple_token_address: true,
                chain_id: true,
              },
              epoch: {
                number: true,
                circle: {
                  id: true,
                  name: true,
                },
              },
              claims: [
                {},
                {
                  id: true,
                  new_amount: true,
                  profile: {
                    id: true,
                    address: true,
                    avatar: true,
                  },
                },
              ],
            },
          ],
        },
      ],
    },
    {
      operationName: 'getEpochData',
    }
  );

  const epoch = gq.epochs_by_pk;

  const distributions = await Promise.all(
    epoch?.distributions.map(async dist => ({
      ...dist,
      pricePerShare: await contracts.getPricePerShare(
        dist.vault.vault_address,
        dist.vault.simple_token_address,
        dist.vault.decimals
      ),
    })) || []
  );

  return { ...epoch, distributions };
};

export type EpochDataResult = Awaited<ReturnType<typeof getEpochData>>;
export type Gift = Exclude<EpochDataResult['token_gifts'], undefined>[0];

export const getPreviousDistribution = async (
  circleId: number,
  vaultId: number
): Promise<typeof distributions[0] | undefined> => {
  const { distributions } = await client.query(
    {
      distributions: [
        {
          order_by: [{ id: order_by.desc }],
          limit: 1,
          where: {
            epoch: { circle_id: { _eq: circleId } },
            vault_id: { _eq: vaultId },
            tx_hash: { _is_null: false },
          },
        },
        {
          id: true,
          vault_id: true,
          distribution_json: [{}, true],
          tx_hash: true,
        },
      ],
    },
    {
      operationName: 'getPreviousDistribution',
    }
  );
  return distributions?.[0];
};

export type PreviousDistribution = Exclude<
  Awaited<ReturnType<typeof getPreviousDistribution>>,
  undefined
>;
