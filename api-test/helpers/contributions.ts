import faker from 'faker';
import { z } from 'zod';

import { GraphQLTypes } from '../../api-lib/gql/__generated__/zeus';

import type { GQLClientType } from './common';

type InsertContributionInput = Partial<typeof contributionSchema['_type']>;

const contributionSchema = z
  .object({
    circle_id: z.number(),
    description: z.string().min(3).max(1000),
    user_id: z.number().int().positive(),
  })
  .strict();

type ContributionResult = Pick<
  GraphQLTypes['contributions'],
  'id' | 'description' | 'deleted_at' | 'user_id'
>;

export async function createContribution(
  client: GQLClientType,
  object: InsertContributionInput
): Promise<ContributionResult | undefined> {
  const { insert_contributions_one } = await client.mutate(
    {
      insert_contributions_one: [
        {
          object: {
            ...object,
            description: object.description ?? faker.lorem.sentences(3),
          },
        },
        { id: true, description: true, user_id: true },
      ],
    },
    { operationName: 'createContribution' }
  );

  if (!insert_contributions_one) {
    throw new Error('Contribution not created');
  }

  return insert_contributions_one;
}

export async function deleteContribution(
  client: GQLClientType,
  payload: { contribution_id: number }
): Promise<{ success: boolean } | undefined> {
  const { deleteContribution } = await client.mutate(
    {
      deleteContribution: [{ payload }, { success: true }],
    },
    { operationName: 'deleteContribution' }
  );

  if (!deleteContribution) {
    throw new Error('Contribution not deleted');
  }

  return deleteContribution;
}

export async function findContributionById(client: GQLClientType, id: number) {
  const { contributions_by_pk } = await client.query(
    {
      contributions_by_pk: [{ id }, { deleted_at: true }],
    },
    { operationName: 'findContribution' }
  );

  return contributions_by_pk;
}
