import faker from 'faker';

import type { GQLClientType } from './common';

export async function createOrganization(
  client: GQLClientType,
  object?: { name: string }
) {
  const { insert_organizations_one } = await client.mutate(
    {
      insert_organizations_one: [
        {
          object: object || {
            name: faker.company.companyName(),
          },
        },
        { id: true, name: true },
      ],
    },
    { operationName: 'createOrganization' }
  );

  if (!insert_organizations_one) {
    throw new Error('Organization not created');
  }

  return insert_organizations_one;
}
