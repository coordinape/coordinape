import { order_by } from 'lib/gql/__generated__/zeus';
import { client } from 'lib/gql/client';
import { DateTime, Interval } from 'luxon';

import { Awaited } from '../../types/shim';

export const getHistoryData = async (circleId: number, userId: number) => {
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
          organization: {
            name: true,
          },

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
                },
                {
                  id: true,
                  number: true,
                  start_date: true,
                  end_date: true,
                  circle_id: true,
                  ended: true,
                  days: true,
                  repeat: true,
                },
              ],
            },
            currentEpoch: {
              epochs: [
                {
                  where: { ended: { _eq: false }, start_date: { _lt: 'now' } },
                  limit: 1,
                },
                {
                  id: true,
                  number: true,
                  start_date: true,
                  end_date: true,
                  circle_id: true,
                  ended: true,
                  days: true,
                  repeat: true,
                },
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
                  number: true,
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
                    {
                      where: { tx_hash: { _is_null: false } },
                    },
                    {
                      id: true,
                      fixed_amount: true,
                      gift_amount: true,
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

  return gq.circles_by_pk;
};

export type QueryResult = Awaited<ReturnType<typeof getHistoryData>>;
export type QueryPastEpoch = Exclude<QueryResult, undefined>['pastEpochs'][0];
export type QueryFutureEpoch = Exclude<
  QueryResult,
  undefined
>['futureEpoch'][0];

export interface IQueryEpoch extends QueryFutureEpoch {
  repeatEnum: 'weekly' | 'monthly' | 'none';
  startDate: DateTime;
  interval: Interval;
  // Calculated:
  calculatedDays: number;
}

export type QueryDistribution = QueryPastEpoch['distributions'][0];
