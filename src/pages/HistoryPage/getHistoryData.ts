import { FixedNumber } from 'ethers';
import { order_by } from 'lib/gql/__generated__/zeus';
import { client } from 'lib/gql/client';
import type { Contracts } from 'lib/vaults';

import { Awaited } from '../../types/shim';

export const getHistoryData = async (
  circleId: number,
  userId: number,
  contracts?: Contracts
) => {
  const gq = await client.query(
    {
      circles_by_pk: [
        { id: circleId },
        {
          name: true,
          token_name: true,
          vouching: true,
          users: [
            { where: { id: { _eq: userId } } },
            { role: true, give_token_remaining: true, non_giver: true },
          ],
          nominees_aggregate: [
            { where: { ended: { _eq: false } } },
            { aggregate: { count: [{}, true] } },
          ],
          __alias: {
            futureEpoch: {
              epochs: [
                {
                  where: { start_date: { _gt: 'now' } },
                  order_by: [{ start_date: order_by.asc }],
                  limit: 1,
                },
                { start_date: true, end_date: true },
              ],
            },
            currentEpoch: {
              epochs: [
                {
                  where: { ended: { _eq: false }, start_date: { _lt: 'now' } },
                  limit: 1,
                },
                { start_date: true, end_date: true },
              ],
            },
            pastEpochs: {
              epochs: [
                {
                  where: { ended: { _eq: true } },
                  order_by: [{ start_date: order_by.desc }],
                },
                {
                  id: true,
                  start_date: true,
                  end_date: true,
                  token_gifts_aggregate: [
                    {},
                    { aggregate: { sum: { tokens: true } } },
                  ],
                  __alias: {
                    receivedGifts: {
                      token_gifts: [
                        { where: { recipient_id: { _eq: userId } } },
                        {
                          id: true,
                          tokens: true,
                          sender: { name: true, profile: { avatar: true } },
                          gift_private: { note: true },
                        },
                      ],
                    },
                    sentGifts: {
                      token_gifts: [
                        { where: { sender_id: { _eq: userId } } },
                        {
                          id: true,
                          tokens: true,
                          recipient: { name: true, profile: { avatar: true } },
                          gift_private: { note: true },
                        },
                      ],
                    },
                  },
                  distributions: [
                    {},
                    {
                      id: true,
                      total_amount: true,
                      vault: {
                        decimals: true,
                        symbol: true,
                        vault_address: true,
                        simple_token_address: true,
                      },
                    },
                  ],
                },
              ],
            },
          },
        },
      ],
    },
    {
      operationName: 'getHistoryData',
    }
  );

  const circle = gq.circles_by_pk;

  if (!contracts) return circle;

  type DistributionWithPrice = Exclude<
    typeof circle,
    undefined
  >['pastEpochs'][0]['distributions'][0] & {
    pricePerShare: FixedNumber;
  };

  // FIXME cache these values by symbol to avoid redundant calls
  for (const epoch of circle?.pastEpochs || []) {
    for (const dist of epoch.distributions) {
      (dist as DistributionWithPrice).pricePerShare =
        await contracts.getPricePerShare(
          dist.vault.vault_address,
          dist.vault.simple_token_address,
          dist.vault.decimals
        );
    }
  }

  return circle;
};

export type QueryResult = Awaited<ReturnType<typeof getHistoryData>>;
export type QueryEpoch = Exclude<QueryResult, undefined>['pastEpochs'][0];

// FIXME find a way to not have to hardcode this.
// in DistributionsPage/queries it works because the return value
// of the query is reassigned, but doing that here, with more
// levels of nesting, creates a mess of `await Promise.all...`
export type QueryDistribution = QueryEpoch['distributions'][0] & {
  pricePerShare: FixedNumber;
};
