import { member_epoch_pgives_select_column } from 'lib/gql/__generated__/zeus';
import { client } from 'lib/gql/client';

import { Awaited } from '../../types/shim';

export const getCoSoulData = async (profileId: number, address: string) => {
  const {
    profileInfo,
    mintInfo,
    totalPgive,
    epochCount,
    organizationCount,
    circleCount,
    organizations,
    circles,
    noteCount,
    contributionCount,
  } = await client.query(
    {
      __alias: {
        profileInfo: {
          profiles: [
            { where: { address: { _eq: address } } },
            {
              id: true,
              avatar: true,
              name: true,
              created_at: true,
            },
          ],
        },
        mintInfo: {
          cosouls: [
            {
              where: {
                profile_id: { _eq: profileId },
              },
            },
            {
              created_at: true,
              token_id: true,
            },
          ],
        },
        totalPgive: {
          member_epoch_pgives_aggregate: [
            {
              where: {
                user: { profile: { address: { _eq: address } } },
              },
            },
            // what is the diff between pgive and normalized_pgive.
            // I thought pgive was normalized give, plus stuff
            { aggregate: { sum: [{}, { normalized_pgive: true }] } },
          ],
        },
        epochCount: {
          member_epoch_pgives_aggregate: [
            {
              where: {
                user: { profile: { address: { _eq: address } } },
              },
            },
            { aggregate: { count: [{}, true] } },
          ],
        },
        organizationCount: {
          member_epoch_pgives_aggregate: [
            {
              where: {
                user: { profile: { address: { _eq: address } } },
              },
              distinct_on: [member_epoch_pgives_select_column.organization_id],
            },
            { aggregate: { count: [{}, true] } },
          ],
        },
        circleCount: {
          member_epoch_pgives_aggregate: [
            {
              where: {
                user: { profile: { address: { _eq: address } } },
              },
              distinct_on: [member_epoch_pgives_select_column.circle_id],
            },
            { aggregate: { count: [{}, true] } },
          ],
        },
        organizations: {
          member_epoch_pgives: [
            {
              where: {
                user: { profile: { address: { _eq: address } } },
              },
              distinct_on: [member_epoch_pgives_select_column.organization_id],
            },
            {
              organization: {
                id: true,
                name: true,
                logo: true,
              },
            },
          ],
        },
        circles: {
          member_circle_pgives: [
            {
              where: {
                user: { profile: { address: { _eq: address } } },
              },
            },
            {
              circle: {
                id: true,
                name: true,
                organization_id: true,
              },
              pgive: true,
              epochs: true,
            },
          ],
        },
        noteCount: {
          note_count: [
            {
              where: {
                profile_id: { _eq: profileId },
              },
            },
            { notes: true },
          ],
        },
        contributionCount: {
          contribution_count: [
            {
              where: {
                profile_id: { _eq: profileId },
              },
            },
            { contributions: true },
          ],
        },
      },
    },
    { operationName: 'getCoSoulData' }
  );

  const orgs = organizations.map(o => o.organization);
  const orgRollup: Record<
    number,
    typeof orgs[number] & {
      circles: {
        name: string;
        pgive: number;
        id: number;
        epochs: number;
      }[];
    }
  > = {};
  for (const org of orgs) {
    if (!org) {
      continue;
    }
    orgRollup[org.id] = { ...org, circles: [] };
  }
  for (const circle of circles) {
    if (!circle.circle) {
      continue;
    }
    const o = orgRollup[circle.circle.organization_id];
    if (!o) {
      continue;
    }
    o.circles.push({
      ...circle.circle,
      pgive: circle.pgive,
      epochs: circle.epochs,
    });
  }
  const orgArray = Object.values(orgRollup).sort((a, b) =>
    a.name > b.name ? -1 : 1
  );
  return {
    // FIXME as any, wut?
    profileInfo: profileInfo[0],
    mintInfo: mintInfo[0],
    totalPgive: (totalPgive.aggregate?.sum as any).normalized_pgive,
    epochCount: epochCount.aggregate?.count,
    organizationCount: organizationCount.aggregate?.count,
    circleCount: circleCount.aggregate?.count,
    organizations: orgArray,
    noteCount: noteCount[0]?.notes ?? 0,
    contributionCount: contributionCount[0]?.contributions ?? 0,
  };
};

export const QUERY_KEY_COSOUL_PAGE = 'cosoulPageQuery';

export type QueryCoSoulResult = Awaited<ReturnType<typeof getCoSoulData>>;
