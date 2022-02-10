import assert from 'assert';

import { gql } from './Gql';

export const getUserFromProfileId = async (
  profileId: number,
  circleId: number
) => {
  const { profiles_by_pk } = await gql.q('query')({
    profiles_by_pk: [
      {
        id: profileId,
      },
      {
        users: [
          {
            where: {
              circle_id: { _eq: circleId },
            },
          },
          {
            id: true,
            role: true,
            address: true,
            circle_id: true,
            give_token_remaining: true,
            give_token_received: true,
            non_giver: true,
            non_receiver: true,
            fixed_non_receiver: true,
            starting_tokens: true,
          },
        ],
      },
    ],
  });
  assert(profiles_by_pk, 'Profile cannot be found');
  const user = profiles_by_pk.users.pop();
  assert(user, `user for circle_id ${circleId} not found`);
  return user;
};
