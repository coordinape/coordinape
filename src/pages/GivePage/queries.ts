import { order_by } from 'lib/gql/__generated__/zeus';
import { client } from 'lib/gql/client';

import { Awaited } from 'types/shim';

// getContributionsForEpoch gets all the contributions for a particular time window for a member
export const getContributionsForEpoch = async ({
  circleId,
  start_date,
  end_date,
  memberId,
}: {
  circleId: number;
  memberId: number;
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
            { member_id: { _eq: memberId } },
          ],
        },
        order_by: [{ datetime_created: order_by.desc }],
      },
      { id: true, description: true, datetime_created: true, member_id: true },
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
      members: [
        {
          where: {
            circle_id: { _eq: circleId },
            address: { _nilike: address },
          },
        },
        {
          id: true,
          circle_id: true,
          name: true,
          bio: true,
          non_receiver: true,
          fixed_non_receiver: true,
          profile: {
            avatar: true,
            id: true,
          },
          contributions_aggregate: [
            {
              where: {
                _and: [
                  { circle_id: { _eq: circleId } },
                  { datetime_created: { _gt: start_date.toISOString() } },
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
            member: {
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
    allUsers: data?.members,
  };
};

export type PotentialTeammate = Awaited<
  ReturnType<typeof getMembersWithContributions>
>['allUsers'][number];

export type Contributions = Awaited<
  ReturnType<typeof getContributionsForEpoch>
>;
