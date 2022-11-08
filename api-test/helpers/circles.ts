import faker from 'faker';
import { z } from 'zod';

import { createOrganization } from '.';
import type { GQLClientType } from './common';

const createCircleSchemaInput = z
  .object({
    name: z.string().min(3).max(255),
    organization_id: z.number().int().positive(),
  })
  .strict();

type CircleInput = typeof createCircleSchemaInput['_type'];

export function getCircleName() {
  try {
    return faker.unique(faker.commerce.department);
  } catch (_) {
    return faker.commerce.color();
  }
}

export async function createCircle(
  client: GQLClientType,
  object?: Partial<CircleInput>
): Promise<{ id: number }> {
  let organizationId = object?.organization_id;

  if (!organizationId) {
    const organization = await createOrganization(client, {
      name: faker.unique(faker.company.companyName),
    });

    if (!organization?.id) {
      throw new Error('Organization needed to create a circle');
    }
    organizationId = organization?.id;
  }

  const { insert_circles_one } = await client.mutate({
    insert_circles_one: [
      {
        object: {
          ...object,
          name: object?.name ?? getCircleName(),
          organization_id: organizationId,
        },
      },
      {
        id: true,
      },
    ],
  });

  if (!insert_circles_one) {
    throw new Error('Circle not created');
  }

  return insert_circles_one;
}
