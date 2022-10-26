import assert from 'assert';

import { Selector, GraphQLTypes, InputType } from './gql/__generated__/zeus';
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
          nominated_by_member_id: true,
          circle_id: true,
          description: true,
          nominated_date: true,
          expiry_date: true,
          vouches_required: true,
          member_id: true,
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

const memberWithCircleSelector = Selector('members')({
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
    id: true,
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
  profile: {
    id: true,
  },
});

export type MemberWithCircleResponse = InputType<
  GraphQLTypes['members'],
  typeof memberWithCircleSelector
>;

export const getMemberFromProfileIdWithCircle = async (
  profileId: number,
  circleId: number
): Promise<MemberWithCircleResponse> => {
  const { profiles_by_pk } = await adminClient.query(
    {
      profiles_by_pk: [
        {
          id: profileId,
        },
        {
          members: [
            {
              where: {
                circle_id: { _eq: circleId },
              },
            },
            memberWithCircleSelector,
          ],
        },
      ],
    },
    {
      operationName: 'getMemberFromProfileIdWithCircle',
    }
  );
  assert(profiles_by_pk, 'Profile cannot be found');
  const member = profiles_by_pk.members.pop();
  assert(member, `user for circle_id ${circleId} not found`);
  return member;
};

export const getUserWithCircle = async (
  memberId: number,
  circleId: number
): Promise<MemberWithCircleResponse> => {
  const { members_by_pk: member } = await adminClient.query(
    {
      members_by_pk: [
        {
          id: memberId,
        },
        memberWithCircleSelector,
      ],
    },
    {
      operationName: 'getMemberWithCircle',
    }
  );
  assert(member, 'Member cannot be found');
  assert(
    member.circle.id === circleId,
    `Member does not belong to circle_id ${circleId}.`
  );
  return member;
};

export const insertNominee = async (params: {
  nominated_by_member_id: number;
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
  const input = { ...params, nomination_days_limit: undefined };
  const { insert_nominees_one } = await adminClient.mutate(
    {
      insert_nominees_one: [
        {
          object: {
            ...input,
            nominated_date: today.toISOString(),
            expiry_date: expiry.toISOString(),
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
