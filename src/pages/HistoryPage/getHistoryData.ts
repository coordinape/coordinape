import { order_by } from 'lib/gql/__generated__/zeus';
import { client } from 'lib/gql/client';

export const getHistoryData = (circleId: number, userId: number) =>
  client.query({
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
          future: {
            epochs: [
              {
                where: { start_date: { _gt: 'now' } },
                order_by: [{ start_date: order_by.asc }],
                limit: 1,
              },
              { start_date: true, end_date: true },
            ],
          },
          current: {
            epochs: [
              {
                where: { ended: { _eq: false }, start_date: { _lt: 'now' } },
                limit: 1,
              },
              { start_date: true, end_date: true },
            ],
          },
          past: {
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
                  received: {
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
                  sent: {
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
                    },
                  },
                ],
              },
            ],
          },
        },
      },
    ],
  });
