/* eslint-disable @typescript-eslint/no-unused-vars */
import { order_by } from '../../lib/gql/__generated__/zeus';
import { client } from '../../lib/gql/client';

const PAGE_SIZE = 10;

export const getActivities = async (circleId: number, page: number) => {
  const { contributions } = await client.query(
    {
      contributions: [
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
          description: true,
          user: {
            name: true,
            profile: {
              name: true,
              avatar: true,
            },
          },
        },
      ],
    },
    {
      operationName: 'getActivity__circleActivity',
    }
  );

  // type Contrib = Awaited<typeof contributions>['contributions'][number];
  // type User = Contrib['user'];
  // const hasProfile = (c: [number] | undefined): c is IApiUser => {
  //   return !!user;
  // };

  // TODO: make the database handle this properly
  return contributions.map(c => ({
    ...c,
    user: {
      ...c.user,
      name: c.user.name as string,
      profile: { ...c.user.profile, name: c.user.profile.name as string },
    },
  }));
};
