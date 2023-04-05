/* eslint-disable no-console */

import assert from 'assert';

import fp from 'lodash/fp';

import { adminClient as client } from '../../api-lib/gql/adminClient';

export const init = async () => {
  const createMembersFromCircles = async (orgId: number) => {
    const { organizations_by_pk: org } = await client.query(
      {
        organizations_by_pk: [
          { id: orgId },
          {
            members: [{}, { profile: { id: true } }],
            circles: [{}, { users: [{}, { profile: { id: true } }] }],
          },
        ],
      },
      { operationName: 'repl' }
    );

    assert(org);

    const existing = org.members.map(m => m.profile.id);
    const all = org.circles.flatMap(c => c.users.map(u => u.profile.id));
    const missing = fp.uniq(fp.difference(all, existing));

    return client.mutate(
      {
        insert_org_members: [
          { objects: missing.map(id => ({ profile_id: id, org_id: orgId })) },
          { affected_rows: true },
        ],
      },
      { operationName: 'repl' }
    );
  };

  return {
    createMembersFromCircles,
  };
};
