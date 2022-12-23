import faker from 'faker';

import type { GQLClientType } from './common';

type ProfileInput = { address: string; name?: string };

export async function createProfile(
  client: GQLClientType,
  object?: ProfileInput
): Promise<{ id: number }> {
  if (!object) {
    object = {
      address: faker.finance.ethereumAddress(),
      name: `${faker.name.firstName()} ${faker.datatype.number(10000)}`,
    };
  }
  const { insert_profiles_one } = await client.mutate({
    insert_profiles_one: [{ object }, { id: true }],
  });

  if (!insert_profiles_one) {
    throw new Error('Profile not created');
  }

  return insert_profiles_one;
}
