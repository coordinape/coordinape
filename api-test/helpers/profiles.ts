import assert from 'assert';

import faker from 'faker';

import { profiles_constraint } from '../../api-lib/gql/__generated__/zeus';

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
  const { insert_profiles_one: profile } = await client.mutate(
    {
      insert_profiles_one: [
        {
          object,
          on_conflict: {
            constraint: profiles_constraint.profiles_address_key,
            update_columns: [],
          },
        },

        { id: true, name: true, address: true },
      ],
    },
    { operationName: 'createProfile' }
  );
  assert(profile, 'Profile not created');
  return profile;
}
