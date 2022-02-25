import assert from 'assert';
import { gql } from './Gql';

export const getNomineeFromAddress = async (
  address: string,
  circleId: number
) => {
  const { nominees } = await gql.q('query')({
    nominees: [
      {
        where: {
          _and: [
            {
              address: { _eq: address },
              circle_id: { _eq: circleId },
              ended: { _eq: false },
            },
          ],
        },
      },
      {
        id: true,
      },
    ],
  });

  return nominees;
};

export const getUserFromAddress = async (address: string, circleId: number) => {
  const { users } = await gql.q('query')({
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
      },
    ],
  });

  return users;
};

export const getUserFromProfileIdWithCircle = async (
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
            circle: {
              nomination_days_limit: true,
              min_vouches: true,
            },
            id: true,
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

export const insertNominee = async (
  nominatedByUserId: number,
  circleId: number,
  address: string,
  name: string,
  description: string,
  nominationDaysLimit: number,
  vouchesRequired: number
) => {
  const today = new Date();
  const expiry = new Date();
  expiry.setDate(today.getDate() + nominationDaysLimit);
  const { insert_nominees_one } = await gql.q('mutation')({
    insert_nominees_one: [
      {
        object: {
          address: address,
          circle_id: circleId,
          name: name,
          description: description,
          nominated_by_user_id: nominatedByUserId,
          nominated_date: today,
          expiry_date: expiry,
          vouches_required: vouchesRequired,
        },
      },
      {
        id: true,
      },
    ],
  });

  return insert_nominees_one;
};

