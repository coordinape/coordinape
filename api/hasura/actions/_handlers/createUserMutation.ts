import { ValueTypes } from '../../../../api-lib/gql/__generated__/zeus';
import { adminClient } from '../../../../api-lib/gql/adminClient';
import { UnprocessableError } from '../../../../api-lib/HttpError';

async function checkExistingUser(address: string, circleId: number) {
  const { users: existingUsers } = await adminClient.query(
    {
      users: [
        {
          limit: 1,
          where: {
            address: { _ilike: address },
            circle_id: { _eq: circleId },
          },
        },
        {
          id: true,
          deleted_at: true,
        },
      ],
    },
    {
      operationName: 'createUser_getExistingUser',
    }
  );

  const existingUser = existingUsers.pop();
  if (existingUser && !existingUser.deleted_at) {
    throw new UnprocessableError('User already exists');
  }
  return existingUser;
}
async function checkExistingProfile(address: string) {
  const { profiles } = await adminClient.query(
    {
      profiles: [{ where: { address: { _ilike: address } } }, { id: true }],
    },
    {
      operationName: 'createUser_getProfile',
    }
  );

  const profile = profiles.pop();
  return profile;
}

export async function createUserMutation(
  address: string,
  circleId: number,
  input: ValueTypes['users_set_input'],
  entrance: string
) {
  const softDeletedUser = await checkExistingUser(address, circleId);
  const profile = await checkExistingProfile(address);
  let createProfileMutation = null;

  if (!profile) {
    createProfileMutation = await adminClient.mutate(
      {
        insert_profiles_one: [
          {
            object: {
              address: input.address,
              name: input.name,
            },
          },
          {
            id: true,
          },
        ],
      },
      {
        operationName: 'createUser_createProfile',
      }
    );
  } else {
    const updateProfileMutation = await adminClient.mutate(
      {
        update_profiles_by_pk: [
          {
            pk_columns: { id: profile.id },
            _set: { name: input.name },
          },
          {
            id: true,
          },
        ],
      },
      {
        operationName: 'createUser_updateProfile',
      }
    );
    if (!updateProfileMutation) {
      throw new UnprocessableError('Failed to update user profile');
    }
  }
  if (!profile && !createProfileMutation) {
    throw new UnprocessableError('Failed to create user profile');
  }

  const createUserMutation: ValueTypes['mutation_root'] =
    softDeletedUser?.deleted_at
      ? {
          update_users_by_pk: [
            {
              pk_columns: { id: softDeletedUser.id },
              _set: {
                ...input,
                deleted_at: null,
                entrance: entrance,
              },
            },
            {
              id: true,
            },
          ],
        }
      : {
          insert_users_one: [
            {
              object: {
                ...input,
                address: address,
                circle_id: circleId,
                entrance: entrance,
              },
            },
            {
              id: true,
            },
          ],
        };

  // Update the state after all validations have passed
  const mutationResult = await adminClient.mutate(
    {
      // Insert the user
      ...createUserMutation,
      // End any active nomination
      update_nominees: [
        {
          _set: { ended: true },
          where: {
            circle_id: { _eq: circleId },
            address: { _ilike: address },
            ended: { _eq: false },
          },
        },
        {
          returning: {
            id: true,
          },
        },
      ],
    },
    {
      operationName: 'createUser_insert',
    }
  );
  return mutationResult;
}
