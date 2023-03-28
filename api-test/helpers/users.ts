import assert from 'assert';

import { GraphQLTypes } from '../../api-lib/gql/__generated__/zeus';

import { createCircle } from './circles';
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

  if (!object.circle && !object.circle_id) {
    const circle = await createCircle(client);
    object.circle_id = circle.id;
  }

  const { insert_users_one: user } = await client.mutate(
    {
      insert_users_one: [
        {
          object: {
            ...object,
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
          circle: { id: true, name: true },
        },
      ],
    },
    { operationName: 'createUser' }
  );
  assert(user, 'User not created');
  return user;
}
