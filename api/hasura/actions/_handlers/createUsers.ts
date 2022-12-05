import type { VercelRequest, VercelResponse } from '@vercel/node';

import { authCircleAdminMiddleware } from '../../../../api-lib/circleAdmin';
import { ValueTypes } from '../../../../api-lib/gql/__generated__/zeus';
import { adminClient } from '../../../../api-lib/gql/adminClient';
import { insertInteractionEvents } from '../../../../api-lib/gql/mutations';
import {
  errorResponseWithStatusCode,
  InternalServerError,
  UnprocessableError,
} from '../../../../api-lib/HttpError';
import { ENTRANCE } from '../../../../src/common-lib/constants';
import {
  composeHasuraActionRequestBody,
  createUsersBulkSchemaInput,
} from '../../../../src/lib/zod';

const USER_ALIAS_PREFIX = 'update_user_';
const NOMINEE_ALIAS_PREFIX = 'update_nominee_';

async function handler(req: VercelRequest, res: VercelResponse) {
  // this has to do parseAsync due to the ENS validation
  const {
    input: { payload: input },
    session_variables: sessionVariables,
  } = await composeHasuraActionRequestBody(
    createUsersBulkSchemaInput
  ).parseAsync(req.body);

  const { circle_id, users } = input;

  const uniqueAddresses = [...new Set(users.map(u => u.address.toLowerCase()))];

  // Check if bulk contains duplicates.
  if (uniqueAddresses.length < users.length) {
    const dupes = uniqueAddresses.filter(
      uq => users.filter(u => u.address.toLowerCase() == uq).length > 1
    );
    return errorResponseWithStatusCode(
      res,
      {
        message: `Users list contains duplicate addresses: ${dupes}`,
      },
      422
    );
  }

  // Load all members of the provided circle with duplicate addresses.
  const { users: existingUsers } = await adminClient.query({
    users: [
      {
        where: {
          circle_id: { _eq: circle_id },
          _or: uniqueAddresses.map(add => {
            return { address: { _ilike: add } };
          }),
        },
      },
      {
        id: true,
        address: true,
        deleted_at: true,
        starting_tokens: true,
      },
    ],
  });

  const usersToUpdate = existingUsers.map(eu => {
    const updatedUser = users.find(
      u => u.address.toLowerCase() === eu.address.toLowerCase()
    );
    return {
      ...eu,
      ...updatedUser,
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
        eu => eu.address.toLowerCase() === u.address.toLowerCase()
      );
    })
    .map(u => ({ ...u, circle_id }));

  const updateUsersMutation = usersToUpdate.reduce((opts, user) => {
    opts[USER_ALIAS_PREFIX + user.address] = {
      update_users_by_pk: [
        {
          pk_columns: { id: user.id },
          _set: {
            ...user,
            entrance: ENTRANCE.MANUAL,
            deleted_at: null,
          },
        },
        {
          id: true,
        },
      ],
    };

    // End any active nomination
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

  //check if names are used by other coordinape users
  const { profiles: existingNames, nominees } = await adminClient.query(
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
      nominees: [
        {
          where: {
            ended: { _eq: false },
            _or: newUsers.map(user => {
              return {
                _and: [
                  { name: { _ilike: user.name } },
                  { address: { _nilike: user.address } },
                ],
              };
            }),
          },
        },
        { name: true },
      ],
    },
    {
      operationName: 'createUsers_getExistingNames',
    }
  );

  if (existingNames.length > 0 || nominees.length > 0) {
    const names = existingNames.concat(nominees).map(u => u.name);
    return errorResponseWithStatusCode(
      res,
      {
        message: `Users list contains ${
          names.length > 1
            ? 'names used by other coordinape users'
            : 'a name used by another coordinape user'
        }: ${names}`,
      },
      422
    );
  }

  const { profiles } = await adminClient.query(
    {
      profiles: [
        {
          where: {
            _or: newUsers.map(user => {
              return { address: { _ilike: user.address } };
            }),
          },
        },
        { id: true, address: true, name: true },
      ],
    },
    {
      operationName: 'createUsers_getProfiles',
    }
  );

  const newProfileUsers = newUsers
    .filter(user =>
      profiles.every(
        profile => profile.address.toLowerCase() !== user.address.toLowerCase()
      )
    )
    .map(user => {
      return {
        address: user.address,
        name: user.name,
      };
    });

  const createProfilesMutations = await adminClient.mutate(
    {
      insert_profiles: [
        {
          objects: newProfileUsers,
        },
        {
          returning: {
            id: true,
          },
        },
      ],
    },
    {
      operationName: 'createUsers_createProfiles',
    }
  );
  if (
    !profiles.length &&
    !createProfilesMutations.insert_profiles?.returning.length
  ) {
    throw new UnprocessableError('Failed to create users profiles');
  }
  // Update the state after all validations have passed
  const mutationResult = await adminClient.mutate({
    insert_users: [
      {
        objects: newUsers,
      },
      {
        returning: {
          id: true,
          address: true,
        },
      },
    ],
    __alias: { ...updateUsersMutation },
  });

  const insertedUsers = mutationResult.insert_users?.returning;

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
      event_type: 'add_user',
      profile_id: profileId,
      circle_id: input.circle_id,
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
