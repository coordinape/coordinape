import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';

import { authCircleAdminMiddleware } from '../../../../api-lib/circleAdmin';
import {
  profiles_constraint,
  profiles_update_column,
  ValueTypes,
} from '../../../../api-lib/gql/__generated__/zeus';
import { adminClient } from '../../../../api-lib/gql/adminClient';
import { insertInteractionEvents } from '../../../../api-lib/gql/mutations';
import { getInput } from '../../../../api-lib/handlerHelpers';
import {
  errorResponseWithStatusCode,
  InternalServerError,
} from '../../../../api-lib/HttpError';
import { isValidENS } from '../../../../api-lib/validateENS';
import { ENTRANCE } from '../../../../src/common-lib/constants';
import { zEthAddress, zUsername } from '../../../../src/lib/zod/formHelpers';

const createUserSchemaInput = z
  .object({
    circle_id: z.number(),
    name: zUsername,
    address: zEthAddress,
    non_giver: z.boolean().optional(),
    starting_tokens: z.number().optional().default(100),
    fixed_non_receiver: z.boolean().optional(),
    non_receiver: z.boolean().optional(),
    role: z.number().min(0).max(1).optional(),
    fixed_payment_amount: z.number().min(0).max(100000000000).optional(),
    entrance: z.string(),
  })
  .strict();

const createUsersBulkSchemaInput = z
  .object({
    circle_id: z.number(),
    users: createUserSchemaInput.omit({ circle_id: true }).array().min(1),
  })
  .strict();

const USER_ALIAS_PREFIX = 'update_user_';
const NOMINEE_ALIAS_PREFIX = 'update_nominee_';

async function handler(req: VercelRequest, res: VercelResponse) {
  const { payload, session } = await getInput(req, createUsersBulkSchemaInput, {
    apiPermissions: ['manage_users'],
  });

  const { circle_id, users } = payload;

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

  // Load all members of the provided circle with duplicate addresses.
  const { users: existingUsers } = await adminClient.query(
    {
      users: [
        {
          where: {
            circle_id: { _eq: circle_id },
            _or: uniqueAddresses.map(add => {
              return { profile: { address: { _ilike: add } } };
            }),
          },
        },
        {
          id: true,
          profile: { address: true },
          deleted_at: true,
          starting_tokens: true,
        },
      ],
    },
    { operationName: 'getExistingUsers' }
  );

  const usersToUpdate = existingUsers.map(eu => {
    const updatedUser = users.find(
      u => u.address.toLowerCase() === eu.profile.address.toLowerCase()
    );
    return {
      ...eu,
      profile: undefined,
      ...updatedUser,
      name: undefined,
      give_token_remaining: updatedUser?.starting_tokens,
    };
  });

  // Check if a user exists without a soft deletion conflicts with the new bulk.
  const conflict = usersToUpdate.filter(u => !u.deleted_at);
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

  const newUsers = users
    .filter(u => {
      return !existingUsers.some(
        eu => eu.profile.address.toLowerCase() === u.address.toLowerCase()
      );
    })
    .map(u => ({ ...u, circle_id }));

  const updateUsersMutation = usersToUpdate.reduce((opts, user) => {
    const { address, ...u } = user;
    opts[USER_ALIAS_PREFIX + address] = {
      update_users_by_pk: [
        {
          pk_columns: { id: user.id },
          _set: {
            ...u,
            entrance: ENTRANCE.MANUAL,
            deleted_at: null,
          },
        },
        { id: true },
      ],
    };

    // End any active nomination
    opts[NOMINEE_ALIAS_PREFIX + address] = {
      update_nominees: [
        {
          _set: { ended: true },
          where: {
            circle_id: { _eq: circle_id },
            address: { _ilike: address },
            ended: { _eq: false },
          },
        },
        { returning: { id: true } },
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
            _or: newUsers.map(user => {
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
    { operationName: 'createUsers_getExistingNames' }
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
          objects: newUsers.map(user => {
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
      operationName: 'createUsers_createProfiles',
    }
  );

  //handle new addresses
  const updateNomineesMutation = newUsers.reduce((opts, user) => {
    opts[NOMINEE_ALIAS_PREFIX + user.address] = {
      update_nominees: [
        {
          _set: { ended: true },
          where: {
            circle_id: { _eq: circle_id },
            address: { _ilike: user.address },
            ended: { _eq: false },
          },
        },
        {
          returning: {
            id: true,
          },
        },
      ],
    };
    return opts;
  }, {} as { [aliasKey: string]: ValueTypes['mutation_root'] });

  //get profile IDs
  const { profiles: profilesIds } = await adminClient.query(
    {
      profiles: [
        {
          where: {
            _or: newUsers.map(user => ({
              address: { _eq: user.address.toLowerCase() },
            })),
          },
        },
        { id: true, address: true },
      ],
    },
    { operationName: 'createUsers_getProfileId' }
  );

  if (profilesIds.length !== newUsers.length) {
    return errorResponseWithStatusCode(
      res,
      {
        message: `Failed to fetch profile Id`,
      },
      422
    );
  }

  const newUsersObjects = newUsers.map(user => {
    const profile_id: number = profilesIds.find(
      p => p.address.toLowerCase() === user.address.toLowerCase()
    )?.id;

    return {
      ...user,
      profile_id,
      name: undefined,
      address: undefined,
    };
  });

  // Update the state after all validations have passed
  const mutationResult = await adminClient.mutate(
    {
      insert_users: [
        { objects: newUsersObjects },
        {
          returning: { id: true, profile: { address: true } },
        },
      ],
      __alias: { ...updateUsersMutation, ...updateNomineesMutation },
    },
    { operationName: 'insertUsersNominees' }
  );

  const insertedUsers = mutationResult.insert_users?.returning;

  if (!insertedUsers)
    throw new InternalServerError(
      `panic: insertedUsers is null; ${JSON.stringify(mutationResult, null, 2)}`
    );

  let profileId: number;
  if (session.hasuraRole == 'user') {
    profileId = session.hasuraProfileId;
  }

  await insertInteractionEvents(
    ...insertedUsers.map(invitedUserId => ({
      event_type: 'add_user',
      profile_id: profileId,
      circle_id: payload.circle_id,
      data: { invited_user_id: invitedUserId },
    }))
  );

  // Get the returning values from each update-user aliases.
  const results: Array<{ id: number }> = usersToUpdate
    .map(u => mutationResult[USER_ALIAS_PREFIX + u.address] as { id: number })
    .concat(insertedUsers);

  return res.status(200).json(results);
}

export default authCircleAdminMiddleware(handler);
