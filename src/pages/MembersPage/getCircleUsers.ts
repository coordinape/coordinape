import { client } from 'lib/gql/client';
import { Role } from 'lib/users';

import { Awaited } from '../../types/shim';

export const getCircleUsers = async (circleId: number) => {
  const { users } = await client.query(
    {
      users: [
        {
          where: {
            _and: [
              {
                circle_id: { _eq: circleId },
                deleted_at: { _is_null: true },
              },
            ],
          },
        },
        {
          id: true,
          circle_id: true,
          address: true,
          non_giver: true,
          fixed_non_receiver: true,
          starting_tokens: true,
          bio: true,
          non_receiver: true,
          give_token_received: true,
          give_token_remaining: true,
          epoch_first_visit: true,
          created_at: true,
          updated_at: true,
          deleted_at: true,
          profile: {
            avatar: true,
            id: true,
            address: true,
            skills: true,
            name: true,
          },
          role: true,
          user_private: { fixed_payment_amount: true },
          teammates: [{}, { teammate: { id: true } }],
        },
      ],
    },
    { operationName: 'query_getCircleUsers' }
  );

  return users.map(user => ({
    ...user,
    isCircleAdmin: user.role === Role.ADMIN,
    isCoordinapeUser: user.role === Role.COORDINAPE,
    fixed_payment_amount: user.user_private?.fixed_payment_amount,
  }));
};

export type ICircleUser = Awaited<ReturnType<typeof getCircleUsers>>[0];
export const QUERY_KEY_CIRCLE_USERS = 'query_getCircleUsers';
