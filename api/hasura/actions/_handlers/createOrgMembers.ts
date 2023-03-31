import assert from 'assert';

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { DateTime } from 'luxon';
import { z } from 'zod';

import {
  profiles_constraint,
  profiles_update_column,
  org_members_constraint,
  org_members_update_column,
} from '../../../../api-lib/gql/__generated__/zeus';
import { adminClient } from '../../../../api-lib/gql/adminClient';
import { insertInteractionEvents } from '../../../../api-lib/gql/mutations';
import { errorResponseWithStatusCode } from '../../../../api-lib/HttpError';
import { authOrgAdminMiddleware } from '../../../../api-lib/orgAdmin';
import { isValidENS } from '../../../../api-lib/validateENS';
import { composeHasuraActionRequestBodyWithApiPermissions } from '../../../../src/lib/zod';
import { zUsername, zEthAddress } from '../../../../src/lib/zod/formHelpers';

const createOrgMemberSchemaInput = z
  .object({
    name: zUsername,
    address: zEthAddress,
    entrance: z.string(),
  })
  .strict();

const createOrgUsersBulkSchemaInput = z
  .object({
    org_id: z.number(),
    users: createOrgMemberSchemaInput.array().min(1),
  })
  .strict();

async function handler(req: VercelRequest, res: VercelResponse) {
  // this has to do parseAsync due to the ENS validation
  const {
    input: { payload: input },
  } = await composeHasuraActionRequestBodyWithApiPermissions(
    createOrgUsersBulkSchemaInput,
    ['manage_users']
  ).parseAsync(req.body);

  const { org_id, users } = input;

  const uniqueAddresses = [...new Set(users.map(u => u.address.toLowerCase()))];

  // Check if entries contains duplicate addresses.
  if (uniqueAddresses.length < users.length) {
    const dupes = uniqueAddresses.filter(
      uq => users.filter(u => u.address.toLowerCase() == uq).length > 1
    );
    return errorResponseWithStatusCode(
      res,
      { message: `Users list contains duplicate addresses: ${dupes}` },
      422
    );
  }

  // Validate ENS names.
  const unresolvedUsers = await Promise.all(
    users.map(async user => {
      if (user.name.endsWith('.eth')) {
        const validENS = await isValidENS(user.name, user.address);
        if (!validENS) return user;
      }
    })
  );

  const unresolvedNames: string[] = [];
  unresolvedUsers.forEach(u => {
    if (u !== undefined) {
      unresolvedNames.push(u.name);
    }
  });

  if (unresolvedNames.length > 0) {
    return errorResponseWithStatusCode(
      res,
      {
        message: `ENS ${unresolvedNames.join(', ')} ${
          unresolvedNames.length > 1 ? 'do' : 'does'
        } not resolve to the entered ${
          unresolvedNames.length > 1 ? 'addresses' : 'address'
        }.`,
      },
      422
    );
  }

  // process each entry in parallel
  const org_members = await Promise.all(
    users.map(u =>
      addMemberToOrg({
        org_id: org_id,
        name: u.name,
        address: u.address,
        entrance: u.entrance,
      }).catch(e => {
        throw e;
      })
    )
  );

  await insertInteractionEvents(
    ...org_members
      .filter(m => m.new)
      .map(m => ({
        event_type: 'add_org_member',
        profile_id: m.id,
        org_id: org_id,
      }))
  );

  return res.status(200).json(org_members);
}

const addMemberToOrg = async ({
  org_id,
  name,
  address,
  entrance,
}: {
  org_id: number;
  name: string;
  address: string;
  entrance: string;
}) => {
  // get or create profile id
  const { insert_profiles_one: profile } = await adminClient.mutate(
    {
      insert_profiles_one: [
        {
          object: {
            name: name,
            address: address.toLowerCase(),
          },
          on_conflict: {
            constraint: profiles_constraint.profiles_address_key,
            update_columns: [profiles_update_column.address],
          },
        },
        { id: true },
      ],
    },
    {
      operationName: 'createOrgMember_createProfiles',
    }
  );

  assert(profile, 'profile should exist');

  // add user to org_members with deleted_at null (handles un-deleted case)
  const { insert_org_members_one } = await adminClient.mutate(
    {
      insert_org_members_one: [
        {
          object: {
            org_id: org_id,
            profile_id: profile.id,
            deleted_at: null,
            entrance: entrance,
          },
          on_conflict: {
            constraint:
              org_members_constraint.org_members_profile_id_org_id_key,
            update_columns: [
              org_members_update_column.entrance,
              org_members_update_column.deleted_at,
            ],
          },
        },
        { id: true, created_at: true },
      ],
    },
    { operationName: 'createOrgMember_createOrgMember' }
  );

  assert(insert_org_members_one, 'org member should exist');

  // consider new if created within 1m
  const new_obj =
    DateTime.fromISO(insert_org_members_one.created_at) >
    DateTime.now().minus({ minutes: 1 });
  return { id: insert_org_members_one.id, new: new_obj };
};

export default authOrgAdminMiddleware(handler);
