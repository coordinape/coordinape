import assert from 'assert';

import { Selector } from './gql/__generated__/zeus';
import { adminClient } from './gql/adminClient';

const userSelector = Selector('users')({
  id: true,
  role: true,
  profile: {
    address: true,
    name: true,
  },
  circle_id: true,
  give_token_remaining: true,
  give_token_received: true,
  non_giver: true,
  non_receiver: true,
  fixed_non_receiver: true,
  starting_tokens: true,
  fixed_payment_amount: true,
});

// TODO: implement org admins
// For now, an org admin is an admin of the org's circles.
export const isOrgAdmin = async (orgId: number, profileId: number) => {
  const { profiles_by_pk } = await adminClient.query(
    {
      profiles_by_pk: [
        { id: profileId },
        {
          users_aggregate: [
            {
              where: {
                role: { _eq: 1 },
                circle: { organization_id: { _eq: orgId } },
              },
            },
            { aggregate: { count: [{}, true] } },
          ],
        },
      ],
    },
    { operationName: 'isOrgAdmin__findUsers' }
  );

  return profiles_by_pk?.users_aggregate?.aggregate?.count || 0 > 0;
};

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
            userSelector,
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
                profile: { address: { _eq: address } },
                circle_id: { _eq: circleId },
                deleted_at: { _is_null: true },
              },
            ],
          },
        },
        userSelector,
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
        userSelector,
      ],
    },
    {
      operationName: 'getUsersFromUserIds',
    }
  );

  return users;
};
