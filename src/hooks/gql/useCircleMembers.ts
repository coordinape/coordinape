import { QueryClient, useQuery } from 'react-query';

import { client } from '../../lib/gql/client';
import { Awaited } from '../../types/shim';

const queryKey = (circleId: number) => {
  return ['members-for-circle-', circleId];
};

export function invalidateCircleMembers(client: QueryClient, circleId: number) {
  client.invalidateQueries(queryKey(circleId));
}

export function useCircleMembers(circleId: number) {
  return {
    ...useQuery(
      queryKey(circleId),
      async () => {
        const { users } = await client.query({
          users: [
            {
              where: {
                circle_id: {
                  _eq: circleId,
                },
                deleted_at: {
                  _is_null: true,
                },
              },
            },
            {
              id: true,
              name: true,
              role: true,
              fixed_non_receiver: true,
              non_receiver: true,
              give_token_remaining: true,
              non_giver: true,
              starting_tokens: true,
              give_token_received: true,
              profile: {
                id: true,
                avatar: true,
                address: true,
              },
            },
          ],
        });
        // enforce here that profile is not null, since it isn't handled by FK->zeus generation
        // still have to do type wizardy to fix this in the exported type here
        return users.filter(u => !!u);
      },
      {}
    ),
    invalidate: (client: QueryClient) =>
      invalidateCircleMembers(client, circleId),
  };
}

type elementType = NonNullable<
  Awaited<ReturnType<typeof useCircleMembers>>['data']
>[number];

export type CircleMember = Omit<elementType, 'profile'> & {
  profile: NonNullable<elementType['profile']>;
};
