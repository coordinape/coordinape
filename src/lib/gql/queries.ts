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
