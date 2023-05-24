import assert from 'assert';

import type { VercelRequest, VercelResponse } from '@vercel/node';

import { member_epoch_pgives_select_column } from '../../api-lib/gql/__generated__/zeus';
import { adminClient } from '../../api-lib/gql/adminClient';
import { errorResponse } from '../../api-lib/HttpError';
import { Awaited } from '../../api-lib/ts4.5shim';

const CACHE_SECONDS = 60 * 5;
export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    let address: string | undefined;
    if (typeof req.query.address == 'string') {
      address = req.query.address;
    } else if (Array.isArray(req.query.address)) {
      address = req.query.address.pop();
    }

    assert(address, 'no address provided');
    address = address.toLowerCase();

    const data = await getCosoulData(address);

    res.setHeader('Cache-Control', 'max-age=0, s-maxage=' + CACHE_SECONDS);
    return res.status(200).send(data);
  } catch (error: any) {
    return errorResponse(res, error);
  }
}

async function getCosoulData(address: string) {
  // fetch profileId from address
  const { profiles } = await adminClient.query(
    {
      profiles: [
        {
          where: {
            address: { _ilike: address },
          },
          limit: 1,
        },
        {
          id: true,
        },
      ],
    },
    {
      operationName: 'cosoulApi__fetchProfileId',
    }
  );

  const profileId = profiles[0].id;
  assert(profileId, 'error fetching profileId');
  assert(address, 'error fetching address');

  const {
    totalPgive,
    epochCount,
    organizationCount,
    circleCount,
    organizations,
    circles,
    noteCount,
    contributionCount,
  } = await adminClient.query(
    {
      __alias: {
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
    totalPgive: (totalPgive.aggregate?.sum as any).normalized_pgive,
    epochCount: epochCount.aggregate?.count,
    organizationCount: organizationCount.aggregate?.count,
    circleCount: circleCount.aggregate?.count,
    organizations: orgArray,
    noteCount: noteCount[0]?.notes ?? 0,
    contributionCount: contributionCount[0]?.contributions ?? 0,
  };
}

export type CosoulData = Awaited<ReturnType<typeof getCosoulData>>;
