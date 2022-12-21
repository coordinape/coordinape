import { order_by } from 'lib/gql/__generated__/zeus';
import { client } from 'lib/gql/client';

import { Awaited } from 'types/shim';

// getContributionsForEpoch gets all the contributions for a particular time window for a member
export const getContributionsForEpoch = async ({
  circleId,
  start_date,
  end_date,
  userId,
}: {
  circleId: number;
  userId: number;
  start_date: Date;
  end_date: Date;
}) => {
  const { contributions } = await client.query({
    contributions: [
      {
        where: {
          _and: [
            { datetime_created: { _gt: start_date.toISOString() } },
            { datetime_created: { _lt: end_date.toISOString() } },
            { circle_id: { _eq: circleId } },
            { user_id: { _eq: userId } },
          ],
        },
        order_by: [{ datetime_created: order_by.desc }],
      },
      { id: true, description: true, datetime_created: true, user_id: true },
    ],
  });
  return contributions;
};

// getMembersWithContributions gets all members of a circle with aggregated contribution count and  the list of current teammates
export const getMembersWithContributions = async (
  circleId: number,
  address: string,
  start_date: Date,
  end_date: Date
) => {
  const data = await client.query(
    {
      users: [
        {
          where: {
            circle_id: { _eq: circleId },
          },
        },
        {
          id: true,
          circle_id: true,
          name: true,
          bio: true,
          non_receiver: true,
          fixed_non_receiver: true,
          address: true,
          profile: {
            avatar: true,
            id: true,
            name: true,
          },
          contributions_aggregate: [
            {
              where: {
                _and: [
                  { circle_id: { _eq: circleId } },
                  { datetime_created: { _gte: start_date.toISOString() } },
                  { datetime_created: { _lt: end_date.toISOString() } },
                ],
              },
            },
            { aggregate: { count: [{}, true] } },
          ],
        },
      ],
      teammates: [
        {
          where: {
            user: {
              circle_id: { _eq: circleId },
              address: { _ilike: address },
            },
          },
        },
        {
          team_mate_id: true,
        },
      ],
    },
    {
      operationName: 'membersWithContributions',
    }
  );
  return {
    startingTeammates: data?.teammates?.map(x => ({ id: x.team_mate_id })),
    allUsers: data?.users,
  };
};
export const getCircleAllocationText = async (circleId: number) => {
  const { circle } = await client.query({
    __alias: {
      circle: {
        circles_by_pk: [
          {
            id: circleId,
          },
          {
            alloc_text: true,
          },
        ],
      },
    },
  });
  return circle;
};

export type CircleAllocationText = Awaited<
  ReturnType<typeof getCircleAllocationText>
>;
export const QUERY_KEY_CIRCLE_ALLOCATION_TEXT = 'getCircleAllocationText';

export const getPendingGiftsFrom = async (
  selectedCircleId: number,
  address: string
) => {
  const data = await client.query(
    {
      pending_token_gifts: [
        {
          where: {
            sender_address: {
              _ilike: address,
            },
            circle_id: {
              _eq: selectedCircleId,
            },
          },
        },
        {
          tokens: true,
          recipient_id: true,
          gift_private: {
            note: true,
          },
        },
      ],
    },
    {
      operationName: 'pendingGiftsFrom',
    }
  );

  type GiftWithNote = Omit<
    typeof data.pending_token_gifts[number],
    'gift_private' | 'tokens'
  > & { tokens?: number; note?: string };

  return data.pending_token_gifts.map(g => {
    const gm = g;
    const note = g.gift_private?.note;
    // have to delete this field because spread operator includes it elsewhere and it causes validation issues -g
    delete gm['gift_private'];
    const gwn: GiftWithNote = {
      ...gm,
      note,
    };
    return gwn;
  });
};

export type PotentialTeammate = Awaited<
  ReturnType<typeof getMembersWithContributions>
>['allUsers'][number];

export type Contributions = Awaited<
  ReturnType<typeof getContributionsForEpoch>
>;
