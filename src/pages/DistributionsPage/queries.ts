import assert from 'assert';

import { order_by } from 'lib/gql/__generated__/zeus';
import { client } from 'lib/gql/client';
import type { Contracts } from 'lib/vaults';
import { useQuery } from 'react-query';

import type { Awaited } from 'types/shim';

export const getEpochData = async (
  epochId: number,
  myAddress?: string,
  contracts?: Contracts
) => {
  assert(contracts && myAddress);

  const gq = await client.query({
    epochs_by_pk: [
      { id: epochId },
      {
        id: true,
        number: true,
        ended: true,
        circle: {
          id: true,
          name: true,
          // get this user's role so we can check that they're an admin
          users: [{ where: { address: { _eq: myAddress } } }, { role: true }],

          organization: {
            vaults: [
              {},
              {
                id: true,
                symbol: true,
                decimals: true,
                vault_address: true,
              },
            ],
          },
        },
        token_gifts: [
          {},
          {
            recipient: {
              id: true,
              name: true,
              address: true,
              profile: {
                avatar: true,
              },
            },
            tokens: true,
          },
        ],
        distributions: [
          {},
          {
            created_at: true,
            total_amount: true,
            vault: {
              id: true,
              decimals: true,
              symbol: true,
              vault_address: true,
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
                user: {
                  address: true,
                  name: true,
                  profile: {
                    avatar: true,
                  },
                },
              },
            ],
          },
        ],
      },
    ],
  });

  const epoch = gq.epochs_by_pk;

  const distributions = await Promise.all(
    epoch?.distributions.map(async dist => ({
      ...dist,
      pricePerShare: await contracts.getPricePerShare(
        dist.vault.vault_address,
        dist.vault.symbol,
        dist.vault.decimals
      ),
    })) || []
  );

  return { ...epoch, distributions };
};

export const getPreviousDistribution = async (
  circle_id: number | null | undefined
): Promise<typeof distributions | undefined> => {
  const { distributions } = await client.query({
    distributions: [
      {
        order_by: [{ id: order_by.desc }],
        where: {
          epoch: { circle_id: { _eq: circle_id } },
          saved_on_chain: { _eq: true },
        },
      },
      {
        id: true,
        vault_id: true,
        distribution_json: [{}, true],
      },
    ],
  });
  return distributions;
};

export type PreviousDistribution = Exclude<
  Awaited<ReturnType<typeof getPreviousDistribution>>,
  undefined
>[0];

export function usePreviousDistributions(circleId: number | null | undefined) {
  return useQuery(
    ['previous-distributions-', circleId],
    async () => getPreviousDistribution(circleId),
    { enabled: !!circleId }
  );
}
