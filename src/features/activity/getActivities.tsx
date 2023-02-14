/* eslint-disable @typescript-eslint/no-unused-vars */
import { order_by } from '../../lib/gql/__generated__/zeus';
import { client } from '../../lib/gql/client';

const PAGE_SIZE = 10;

export const getActivities = async (circleId: number, page: number) => {
  const { activities } = await client.query(
    {
      activities: [
        {
          where: {
            circle_id: { _eq: circleId },
          },
          order_by: [
            {
              id: order_by.desc,
            },
          ],
          offset: page * PAGE_SIZE,
          limit: PAGE_SIZE,
        },
        {
          id: true,
          created_at: true,
          updated_at: true,
          action: true,
          actor_profile: {
            id: true,
            name: true,
            avatar: true,
          },
          target_profile: {
            id: true,
            name: true,
            avatar: true,
          },
          circle: {
            id: true,
            name: true,
          },
          organization: {
            id: true,
            name: true,
          },
          contribution: {
            description: true,
            user: {
              name: true,
              profile: {
                name: true,
                avatar: true,
              },
            },
          },
          epoch: {
            id: true,
            description: true,
            start_date: true,
            end_date: true,
            ended: true,
            circle: {
              id: true,
              name: true,
            },
          },
          user: {
            id: true,
            circle_id: true,
            entrance: true,
            profile: {
              id: true,
              name: true,
              address: true,
            },
          },
        },
      ],
    },
    { operationName: 'getActivities' }
  );
  return activities;
};
