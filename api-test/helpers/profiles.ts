import assert from 'assert';

import faker from 'faker';

import { adminClient } from '../../api-lib/gql/adminClient';

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
  } else {
    if (!object.name) {
      object.name = `${faker.name.firstName()} ${faker.datatype.number(10000)}`;
    }
  }

  const { profiles } = await adminClient.query(
    {
      profiles: [
        { where: { address: { _ilike: object.address } } },
        { id: true, name: true, address: true },
      ],
    },
    { operationName: 'createProfile_getExistingProfile' }
  );
  if (!profiles[0]) {
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
  return profiles[0];
}
