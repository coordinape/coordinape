import assert from 'assert';

import faker from 'faker';

import { GraphQLTypes } from '../../api-lib/gql/__generated__/zeus';

import type { GQLClientType } from './common';
import { createProfile } from './profiles';

export async function createUser(
  client: GQLClientType,
  object: Partial<GraphQLTypes['users_insert_input']>
) {
  if (!object.address) {
    const profile = await createProfile(client);
    object.address = profile.address;
  }

  const { insert_users_one: user } = await client.mutate(
    {
      insert_users_one: [
        {
          object: {
            ...object,
            name: object.name ?? faker.unique(faker.name.firstName),
            role: object.role ?? 1,
            starting_tokens: object.starting_tokens ?? 100,
            entrance: object.entrance ?? '?',
          },
        },
        {
          id: true,
          address: true,
          circle_id: true,
          role: true,
          profile: { id: true, address: true, name: true },
        },
      ],
    },
    { operationName: 'createUser' }
  );
  assert(user, 'User not created');
  return user;
}
