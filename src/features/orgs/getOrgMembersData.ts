import { client } from 'lib/gql/client';

import { Awaited } from 'types/shim';

export const getOrgMembersPageData = async (orgId: number) => {
  return client.query(
    {
      organizations_by_pk: [
        { id: orgId },
        {
          members: [
            {},
            {
              id: true,
              profile: {
                avatar: true,
                name: true,
                address: true,
                users: [
                  { where: { circle: { organization_id: { _eq: orgId } } } },
                  {
                    role: true,
                    circle: { name: true, id: true },
                  },
                ],
              },
            },
          ],
        },
      ],
    },
    { operationName: 'getOrgMembersPageData' }
  );
};

export type OrgMembersPageQuery = NonNullable<
  Awaited<ReturnType<typeof getOrgMembersPageData>>['organizations_by_pk']
>;
export type QueryMember = OrgMembersPageQuery['members'][number];

export const QUERY_KEY_GET_ORG_MEMBERS_DATA = 'getOrgMembersPageData';
