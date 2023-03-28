import assert from 'assert';

import faker from 'faker';
import { z } from 'zod';

import type { GQLClientType } from './common';
import { createOrganization } from './organizations';

const createCircleSchemaInput = z
  .object({
    name: z.string().min(3).max(255),
    organization_id: z.number().int().positive(),
  })
  .strict();

type CircleInput = typeof createCircleSchemaInput['_type'];

export function getCircleName() {
  return `${faker.commerce.department()} ${faker.datatype.number(10000)}`;
}

export async function createCircle(
  client: GQLClientType,
  object?: Partial<CircleInput>
) {
  let organizationId = object?.organization_id;

  if (!organizationId) {
    const organization = await createOrganization(client, {
      name: `${faker.company.companyName()} ${faker.datatype.number(10000)}`,
    });

    if (!organization?.id) {
      throw new Error('Organization needed to create a circle');
    }
    organizationId = organization?.id;
  }

  const { insert_circles_one: circle } = await client.mutate(
    {
      insert_circles_one: [
        {
          object: {
            ...object,
            name: object?.name ?? getCircleName(),
            organization_id: organizationId,
          },
        },
        { id: true, name: true, organization: { id: true, name: true } },
      ],
    },
    { operationName: 'createCircle' }
  );

  assert(circle, 'Circle not created');
  return circle;
}
