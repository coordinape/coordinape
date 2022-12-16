import faker from 'faker';

import { GraphQLTypes } from '../../api-lib/gql/__generated__/zeus';

import type { GQLClientType } from './common';

export async function createUser(
  client: GQLClientType,
  object: Partial<GraphQLTypes['users_insert_input']>
): Promise<{ id: number }> {
  const { insert_users_one } = await client.mutate({
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
      { id: true },
    ],
  });
  if (!insert_users_one) {
    throw new Error('User not created');
  }

  return insert_users_one;
}
