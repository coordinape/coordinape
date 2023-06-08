import faker from 'faker';
import merge from 'lodash/merge';

import type { GQLClientType } from './common';

export async function createOrganization(
  client: GQLClientType,
  object?: { name?: string; sample?: boolean }
) {
  const { insert_organizations_one } = await client.mutate(
    {
      insert_organizations_one: [
        {
          object: merge(
            {
              name: faker.company.companyName(),
              sample: false,
            },
            object || {}
          ),
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
