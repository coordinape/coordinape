import { GraphQLTypes } from '../../api-lib/gql/__generated__/zeus';

import { GQLClientType } from './common';

export async function createOrgMember(
  client: GQLClientType,
  object: Partial<GraphQLTypes['org_members_insert_input']>
) {
  const { org_members } = await client.query(
    {
      org_members: [
        {
          where: {
            _and: [
              { org_id: { _eq: object.org_id } },
              { profile_id: { _eq: object.profile_id } },
            ],
          },
        },
        { id: true, org_id: true },
      ],
    },
    { operationName: 'orgMemberHelper_getExistingMembers' }
  );
  const orgMember = org_members.pop();
  if (orgMember) {
    return orgMember;
  }
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
