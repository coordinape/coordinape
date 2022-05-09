import assert from 'assert';

import { adminClient } from './gql/adminClient';

export const getUserFromProfileId = async (
  profileId: number,
  circleId: number
) => {
  const { profiles_by_pk } = await adminClient.query(
    {
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
              name: true,
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
    },
    {
      operationName: 'getUserFromProfileId',
    }
  );
  assert(profiles_by_pk, 'Profile cannot be found');
  const user = profiles_by_pk.users.pop();
  assert(user, `user for circle_id ${circleId} not found`);
  return user;
};

export const getUserFromAddress = async (address: string, circleId: number) => {
  const { users } = await adminClient.query(
    {
      users: [
        {
          where: {
            _and: [
              {
                address: { _eq: address },
                circle_id: { _eq: circleId },
                deleted_at: { _is_null: true },
              },
            ],
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
    {
      operationName: 'getUserFromAddress',
    }
  );

  return users.pop();
};

export const getUsersFromUserIds = async (
  userIds: number[],
  circleId: number
) => {
  const { users } = await adminClient.query(
    {
      users: [
        {
          where: {
            id: { _in: userIds },
            circle_id: { _eq: circleId },
            deleted_at: { _is_null: true },
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
    {
      operationName: 'getUsersFromUserIds',
    }
  );

  return users;
};
