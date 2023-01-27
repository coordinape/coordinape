import assert from 'assert';

import faker from 'faker';

import type { GQLClientType } from './common';

type ProfileInput = { address: string; name?: string };

export async function createProfile(
  client: GQLClientType,
  object?: ProfileInput
) {
  if (!object) {
    object = {
      address: faker.finance.ethereumAddress(),
      name: `${faker.name.firstName()} ${faker.datatype.number(10000)}`,
    };
  }
  const { insert_profiles_one: profile } = await client.mutate(
    {
      insert_profiles_one: [
        { object },
        { id: true, name: true, address: true },
      ],
    },
    { operationName: 'createProfile' }
  );
  assert(profile, 'Profile not created');
  return profile;
}
