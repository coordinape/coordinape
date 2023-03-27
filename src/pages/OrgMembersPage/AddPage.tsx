import assert from 'assert';

import { useLoginData } from 'features/auth';
import { useParams } from 'react-router';

import { AddMembersContents } from 'pages/AddMembersPage/AddMembersPage';

export const AddPage = () => {
  const params = useParams();
  const orgId = Number(params.orgId);

  // we can use loginData for org properties here because you can only view this
  // page if you're in the org
  const profile = useLoginData();

  const org = profile?.org_members.find(m => m.org_id === orgId)?.organization;
  assert(org);

  const save = async () => {
    alert('TODO');
    // TODO
    // save org members
    // clear any affected query caches
    // return replaced names
    return [];
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
