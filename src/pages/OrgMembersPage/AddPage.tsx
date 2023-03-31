import assert from 'assert';

import { useLoginData } from 'features/auth';
import { QUERY_KEY_GET_ORG_MEMBERS_DATA } from 'features/orgs/getOrgMembersData';
import { client } from 'lib/gql/client';
import { useQueryClient } from 'react-query';
import { useParams } from 'react-router';

import { AddMembersContents } from 'pages/AddMembersPage/AddMembersPage';

const lowerEq = (x: string, y?: string) => x.toLowerCase() === y?.toLowerCase();

export const AddPage = () => {
  const params = useParams();
  const orgId = Number(params.orgId);
  const queryClient = useQueryClient();

  // we can use loginData for org properties here because you can only view this
  // page if you're in the org
  const profile = useLoginData();

  const org = profile?.org_members.find(m => m.org_id === orgId)?.organization;
  assert(org);

  const save = async (entries: { address: string; name: string }[]) => {
    const { createOrgMembers } = await client.mutate(
      {
        createOrgMembers: [
          { payload: { org_id: org.id, users: entries } },
          {
            new: true,
            OrgMemberResponse: {
              profile: { name: true, address: true },
            },
          },
        ],
      },
      { operationName: 'createOrgMembers' }
    );

    // TODO clear any affected query caches
    await queryClient.invalidateQueries([
      QUERY_KEY_GET_ORG_MEMBERS_DATA,
      orgId,
    ]);

    const replacedNames = createOrgMembers
      ?.filter(({ OrgMemberResponse: r }) =>
        entries.find(
          e =>
            lowerEq(e.address, r?.profile?.address) &&
            r?.profile.name &&
            e.name !== r?.profile.name
        )
      )
      .map(({ OrgMemberResponse: r }) => ({
        oldName: entries.find(e => lowerEq(e.address, r?.profile?.address))
          ?.name,
        newName: r?.profile.name,
        address: r?.profile.address,
      }));

    return replacedNames || [];
  };

  return (
    <AddMembersContents
      group={org}
      groupType="organization"
      welcomeLink="TODO_welcomeLink"
      inviteLink="TODO_inviteLink"
      revokeInvite={() => alert('TODO: revoke invite')}
      revokeWelcome={() => alert('TODO: revoke welcome')}
      save={save}
    />
  );
};
