import { GraphQLTypes } from '../../api-lib/gql/__generated__/zeus';

import type { GQLClientType } from './common';

export async function createOrgMember(
  client: GQLClientType,
  object: Partial<GraphQLTypes['org_members_insert_input']>
) {
  const { insert_org_members_one } = await client.mutate(
    {
      insert_org_members_one: [
        {
          object: {
            org_id: object.org_id,
            profile_id: object.profile_id,
            role: object.role || 1,
            deleted_at: object?.deleted_at,
          },
        },
        { id: true, org_id: true },
      ],
    },
    { operationName: 'createOrganization' }
  );

  if (!insert_org_members_one) {
    throw new Error('Org member not created');
  }

  return insert_org_members_one;
}
