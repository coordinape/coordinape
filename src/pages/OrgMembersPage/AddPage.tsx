import assert from 'assert';

import { useLoginData } from 'features/auth';
import { QUERY_KEY_GET_ORG_MEMBERS_DATA } from 'features/orgs/getOrgMembersData';
import { useOrgInviteToken } from 'features/orgs/useOrgInviteToken';
import { client } from 'lib/gql/client';
import { useQueryClient } from 'react-query';
import { useParams } from 'react-router';

import { APP_URL } from '../../utils/domain';
import { AddMembersContents } from 'pages/AddMembersPage/AddMembersPage';
import type { ChangedUser } from 'pages/AddMembersPage/NewMemberList';
import { paths } from 'routes/paths';

const lowerEq = (x: string, y?: string) => x.toLowerCase() === y?.toLowerCase();

export const AddPage = () => {
  const params = useParams();
  const orgId = Number(params.orgId);
  const queryClient = useQueryClient();

  // we can use loginData for org properties here because you can only view this
  // page if you're in the org
  const profile = useLoginData();

  const { data: inviteToken } = useOrgInviteToken(orgId);
  const inviteLink = inviteToken
    ? APP_URL + paths.join(inviteToken)
    : 'Loading...';

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

    await queryClient.invalidateQueries([
      QUERY_KEY_GET_ORG_MEMBERS_DATA,
      orgId,
    ]);

    return (
      createOrgMembers?.reduce<ChangedUser[]>(
        (ret, { OrgMemberResponse: r, new: new_ }) => {
          const { name, address } = r?.profile || {};
          const inputEntry = entries.find(e => lowerEq(e.address, address));

          if (inputEntry?.name !== name || !new_) {
            ret.push({
              existing: !new_,
              address,
              oldName: inputEntry?.name,
              newName: name,
            });
          }

          return ret;
        },
        []
      ) || []
    );
  };

  return (
    <AddMembersContents
      group={org}
      groupType="organization"
      inviteLink={inviteLink}
      revokeInvite={() => alert('TODO: revoke invite')}
      save={save}
    />
  );
};
