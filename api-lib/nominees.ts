import assert from 'assert';

import { adminClient } from './gql/adminClient';

export const getNomineeFromAddress = async (
  address: string,
  circleId: number
) => {
  const { nominees } = await adminClient.query(
    {
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
          name: true,
          address: true,
          nominated_by_user_id: true,
          circle_id: true,
          description: true,
          nominated_date: true,
          expiry_date: true,
          vouches_required: true,
          user_id: true,
          ended: true,
          created_at: true,
          updated_at: true,
        },
      ],
    },
    {
      operationName: 'getNomineeFromAddress',
    }
  );

  return nominees.pop();
};

export const getUserFromProfileIdWithCircle = async (
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
              pending_sent_gifts: [
                {},
                {
                  id: true,
                  recipient_id: true,
                  recipient_address: true,
                  note: true,
                  tokens: true,
                },
              ],
              circle: {
                nomination_days_limit: true,
                min_vouches: true,
                epochs: [
                  {
                    where: {
                      _and: [
                        { end_date: { _gt: 'now()' } },
                        { start_date: { _lt: 'now()' } },
                      ],
                    },
                  },
                  {
                    start_date: true,
                    end_date: true,
                    id: true,
                  },
                ],
              },
              id: true,
              address: true,
              give_token_remaining: true,
              starting_tokens: true,
              non_giver: true,
            },
          ],
        },
      ],
    },
    {
      operationName: 'getUserFromProfileIdWithCircle',
    }
  );
  assert(profiles_by_pk, 'Profile cannot be found');
  const user = profiles_by_pk.users.pop();
  assert(user, `user for circle_id ${circleId} not found`);
  return user;
};

export const insertNominee = async (params: {
  nominated_by_user_id: number;
  circle_id: number;
  address: string;
  name: string;
  description: string;
  nomination_days_limit: number;
  vouches_required: number;
}) => {
  const today = new Date();
  const expiry = new Date();
  expiry.setDate(today.getDate() + params.nomination_days_limit);
  const { insert_nominees_one } = await adminClient.mutate(
    {
      insert_nominees_one: [
        {
          object: {
            ...params,
            nominated_date: today,
            expiry_date: expiry,
          },
        },
        {
          id: true,
        },
      ],
    },
    { operationName: 'insertNominee' }
  );

  return insert_nominees_one;
};
