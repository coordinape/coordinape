import { client } from 'lib/gql/client';

import { Awaited } from 'types/shim';

export const initialQuery = async (id: number) => {
  const { circles_by_pk } = await client.query(
    {
      circles_by_pk: [
        { id },
        {
          id: true,
          name: true,
          alloc_text: true,
          allow_distribute_evenly: true,
          token_name: true,
          epochs: [
            {},
            {
              id: true,
              number: true,
              start_date: true,
              end_date: true,
              ended: true,
              repeat: true,
            },
          ],
        },
      ],
    },
    { operationName: 'GivePage_initialQuery' }
  );
  return circles_by_pk;
};

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
  const { contributions } = await client.query(
    {
      contributions: [
        {
          where: {
            _and: [
              { circle_id: { _eq: circleId } },
              { created_at: { _gte: start_date.toISOString() } },
              { created_at: { _lt: end_date.toISOString() } },
              { user_id: { _eq: userId } },
            ],
          },
        },
        { id: true },
      ],
    },
    {
      operationName: 'getContributionsForEpoch',
    }
  );
  return contributions;
};

// getMembersWithContributions gets all members of a circle with aggregated contribution count and  the list of current teammates
export const getMembersWithContributions = async (
  circleId: number,
  profileId: number,
  start_date: Date,
  end_date: Date
) => {
  // eslint-disable-next-line no-console
  console.log({ start_date, end_date });
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
          bio: true,
          non_receiver: true,
          fixed_non_receiver: true,
          profile: {
            avatar: true,
            id: true,
            name: true,
            address: true,
            cosoul: {
              id: true,
            },
          },
          contributions_aggregate: [
            {
              where: {
                _and: [
                  { circle_id: { _eq: circleId } },
                  { created_at: { _gte: start_date.toISOString() } },
                  { created_at: { _lt: end_date.toISOString() } },
                ],
              },
            },
            { aggregate: { count: [{}, true] } },
          ],
          pending_sent_gifts: [
            {
              where: { circle_id: { _eq: circleId } },
            },
            {
              tokens: true,
            },
          ],
        },
      ],
      teammates: [
        {
          where: {
            user: {
              circle_id: { _eq: circleId },
              profile_id: { _eq: profileId },
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

export const QUERY_KEY_GIVE_PAGE = 'getGivePageData';

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
