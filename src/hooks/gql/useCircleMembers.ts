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
              circle_id: true,
              name: true,
              role: true,
              epoch_first_visit: true,
              created_at: true,
              updated_at: true,
              fixed_non_receiver: true,
              non_receiver: true,
              give_token_remaining: true,
              non_giver: true,
              starting_tokens: true,
              give_token_received: true,
              address: true,
              profile: {
                id: true,
                avatar: true,
                address: true,
                updated_at: true,
                created_at: true,
                admin_view: true,
              },
            },
          ],
        });

        // const adaptedUsers = users.map(u => {
        //   let newType: Omit<typeof u, 'created_at | updated_at'>;
        //
        //   const adaptedUser: Omit<typeof u, 'created_at | updated_at'> & {
        //     // created_at: string;
        //     // updated_at: string;
        //   } = {
        //     ...u,
        //     // created_at: 'something',
        //     // updated_at: 'something',
        //   };
        //   return adaptedUser;
        // });
        // enforce here that profile is not null, since it isn't handled by FK->zeus generation
        // using a typeguard so we don't have optionals returned
        type elementType = typeof users[number];
        type memberWithProfile = Omit<elementType, 'profile'> & {
          profile: NonNullable<elementType['profile']>;
        };
        return users
          .filter((u): u is memberWithProfile => !!u)
          .map(u => {
            const adaptedUser: Omit<
              typeof u,
              'created_at | updated_at | profile'
            > & {
              created_at: string;
              updated_at: string;
              profile: Omit<typeof u.profile, 'created_at | updated_at'> & {
                created_at: string;
                updated_at: string;
              };
            } = {
              ...u,
              created_at: 'something', // TODO
              updated_at: 'something',
              profile: {
                ...u.profile,
                created_at: 'something',
                updated_at: 'something',
              },
            };
            return adaptedUser;
          });
      },
      {}
    ),
    invalidate: (client: QueryClient) =>
      invalidateCircleMembers(client, circleId),
  };
}

export function circleMemberTypeGuard(u: any): u is CircleMember {
  return !!u;
}

export type CircleMember = NonNullable<
  Awaited<ReturnType<typeof useCircleMembers>>['data']
>[number];
