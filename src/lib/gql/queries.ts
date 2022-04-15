import { order_by } from 'lib/gql/__generated__/zeus';

import { client } from './client';

export const getCurrentEpoch = async (
  circle_id: number
): Promise<typeof currentEpoch | undefined> => {
  const {
    epochs: [currentEpoch],
  } = await client.query({
    epochs: [
      {
        where: {
          circle_id: { _eq: circle_id },
          end_date: { _gt: 'now()' },
          start_date: { _lt: 'now()' },
        },
      },
      { id: true },
    ],
  });
  return currentEpoch;
};

export const getDiscordWebhook = async (circleId: number) => {
  const { circle_private } = await client.query({
    circle_private: [
      {
        where: {
          circle_id: {
            _eq: circleId,
          },
        },
      },
      {
        discord_webhook: true,
      },
    ],
  });
  return circle_private.pop()?.discord_webhook;
};

export const getActiveNominees = async (circleId: number) => {
  const { nominees } = await client.query({
    nominees: [
      {
        where: {
          _and: [
            {
              circle_id: { _eq: circleId },
              vouches_required: { _gt: 0 },
              ended: { _eq: false },
            },
          ],
        },
        order_by: [{ expiry_date: order_by.asc }],
      },
      {
        id: true,
        name: true,
        address: true,
        nominated_by_user_id: true,
        nominations: [
          {},
          {
            created_at: true,
            voucher_id: true,
            id: true,
            voucher: {
              name: true,
              id: true,
              address: true,
            },
          },
        ],
        nominator: {
          address: true,
          name: true,
        },
        description: true,
        nominated_date: true,
        expiry_date: true,
        vouches_required: true,
        ended: true,
      },
    ],
  });

  return nominees;
};
