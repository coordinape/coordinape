import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';

import {
  profiles_constraint,
  profiles_update_column,
  ValueTypes,
} from '../../../../api-lib/gql/__generated__/zeus';
import { adminClient } from '../../../../api-lib/gql/adminClient';
import { insertInteractionEvents } from '../../../../api-lib/gql/mutations';
import {
  errorResponseWithStatusCode,
  InternalServerError,
} from '../../../../api-lib/HttpError';
import { authOrgAdminMiddleware } from '../../../../api-lib/orgAdmin';
import { isValidENS } from '../../../../api-lib/validateENS';
import { ENTRANCE } from '../../../../src/common-lib/constants';
import {
  composeHasuraActionRequestBodyWithApiPermissions,
  createUserSchemaInput,
} from '../../../../src/lib/zod';

const USER_ALIAS_PREFIX = 'update_org_member_';

const createOrgUsersBulkSchemaInput = z
  .object({
    org_id: z.number(),
    users: createUserSchemaInput.omit({ circle_id: true }).array().min(1),
  })
  .strict();

async function handler(req: VercelRequest, res: VercelResponse) {
  // this has to do parseAsync due to the ENS validation
  const {
    input: { payload: input },
    session_variables: sessionVariables,
  } = await composeHasuraActionRequestBodyWithApiPermissions(
    createOrgUsersBulkSchemaInput,
    ['manage_users']
  ).parseAsync(req.body);

  const { org_id, users } = input;

  const uniqueAddresses = [...new Set(users.map(u => u.address.toLowerCase()))];

  // Check if bulk contains duplicates.
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

  // Given a set of new users we separate these into groups of new org members, and updates to existing org members.

  // Check for existing org members with input addresses.
  const { org_members: existingOrgMembers } = await adminClient.query(
    {
      org_members: [
        {
          where: {
            org_id: { _eq: org_id },
            profile: {
              _or: uniqueAddresses.map(addr => {
                return { address: { _ilike: addr } };
              }),
            },
          },
        },
        {
          id: true,
          profile: {
            id: true,
            address: true,
          },
          deleted_at: true,
        },
      ],
    },
    { operationName: 'getExistingOrgUsers' }
  );

  const orgMembersToUpdate = existingOrgMembers.map(eu => {
    const updatedUser = users.find(
      u => u.address.toLowerCase() === eu.profile.address.toLowerCase()
    );
    return {
      ...eu,
      ...updatedUser,
      name: undefined,
    };
  });

  // Check if a user exists without a soft deletion conflicts with the new bulk.
  const conflict = orgMembersToUpdate.filter(u => !u.deleted_at);
  if (conflict.length) {
    return errorResponseWithStatusCode(
      res,
      {
        message: `Users already exist: [${conflict
          .map(e => e.address)
          .join(', ')}]`,
      },
      422
    );
  }

  const newOrgMembers = users
    .filter(u => {
      return !existingOrgMembers.some(
        eu => eu.profile.address.toLowerCase() === u.address.toLowerCase()
      );
    })
    .map(u => ({ ...u, org_id }));

  const updateUsersMutation = orgMembersToUpdate.reduce((opts, user) => {
    opts[USER_ALIAS_PREFIX + user.address] = {
      update_org_members_by_pk: [
        {
          pk_columns: { id: user.id },
          _set: {
            ...user,
            entrance: ENTRANCE.MANUAL,
            deleted_at: null,
          },
        },
        { id: true },
      ],
    };

    return opts;
  }, {} as { [aliasKey: string]: ValueTypes['mutation_root'] });

  //check if names are used by other coordinape users
  const { profiles: existingNames } = await adminClient.query(
    {
      profiles: [
        {
          where: {
            _or: newOrgMembers.map(user => {
              return {
                _and: [
                  { name: { _eq: user.name } },
                  { address: { _nilike: user.address } },
                ],
              };
            }),
          },
        },
        { name: true },
      ],
    },
    { operationName: 'createOrgUsers_getExistingNames' }
  );

  if (existingNames.length > 0) {
    const names = existingNames.map(u => u.name);
    return errorResponseWithStatusCode(
      res,
      {
        message: `Users list contains ${
          names.length > 1 ? 'names already in use' : 'a name already in use'
        }: ${names}`,
      },
      422
    );
  }

  //update profiles table with new names
  await adminClient.mutate(
    {
      insert_profiles: [
        {
          objects: newOrgMembers.map(user => {
            return {
              address: user.address.toLowerCase(),
              name: user.name,
            };
          }),
          on_conflict: {
            constraint: profiles_constraint.profiles_address_key,
            update_columns: [profiles_update_column.name],
            where: {
              name: { _is_null: true },
            },
          },
        },
        { returning: { id: true } },
      ],
    },
    {
      operationName: 'createOrgUsers_createProfiles',
    }
  );

  const newOrgMemberObjects = newOrgMembers.map(user => ({
    ...user,
    name: undefined,
  }));
  // Update the state after all validations have passed
  const mutationResult = await adminClient.mutate(
    {
      insert_org_members: [
        { objects: newOrgMemberObjects },
        {
          returning: { id: true, address: true },
        },
      ],
      __alias: { ...updateUsersMutation },
    },
    { operationName: 'insertOrgMembers' }
  );

  const insertedUsers = mutationResult.insert_org_members?.returning;

  if (!insertedUsers)
    throw new InternalServerError(
      `panic: insertedUsers is null; ${JSON.stringify(mutationResult, null, 2)}`
    );

  let profileId: number;
  if (sessionVariables.hasuraRole == 'user') {
    profileId = sessionVariables.hasuraProfileId;
  }

  await insertInteractionEvents(
    ...insertedUsers.map(invitedUserId => ({
      event_type: 'add_org_member',
      profile_id: profileId,
      org_id: input.org_id,
      data: { invited_user_id: invitedUserId },
    }))
  );

  // Get the returning values from each update-user aliases.
  const results: Array<{ id: number }> = orgMembersToUpdate
    .map(u => mutationResult[USER_ALIAS_PREFIX + u.address] as { id: number })
    .concat(insertedUsers);

  return res.status(200).json(results);
}

export default authOrgAdminMiddleware(handler);
