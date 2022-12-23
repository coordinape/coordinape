import faker from 'faker';

import { createOrganizationSchemaInput } from '../../src/lib/zod';

import type { GQLClientType } from './common';

type OrganizationInput = typeof createOrganizationSchemaInput['_type'];

export async function createOrganization(
  client: GQLClientType,
  object?: OrganizationInput
) {
  const { insert_organizations_one } = await client.mutate({
    insert_organizations_one: [
      {
        object: object || {
          name: faker.company.companyName(),
        },
      },
      { id: true, name: true },
    ],
  });

  if (!insert_organizations_one) {
    throw new Error('Organization not created');
  }

  return insert_organizations_one;
}
