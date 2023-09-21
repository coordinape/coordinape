/* eslint-disable no-console */

import assert from 'assert';

import fp from 'lodash/fp';

import { adminClient as client } from '../../api-lib/gql/adminClient';

export const init = async () => {
  const createMembersForOrg = async (orgId: number) => {
    const { organizations_by_pk: org } = await client.query(
      {
        organizations_by_pk: [
          { id: orgId },
          {
            members: [{}, { profile: { id: true } }],
            circles: [
              { where: { deleted_at: { _is_null: true } } },
              {
                users: [
                  { where: { deleted_at: { _is_null: true } } },
                  { profile: { id: true } },
                ],
              },
            ],
          },
        ],
      },
      { operationName: 'repl_getUsers' }
    );

    assert(org, `no org with id ${orgId}`);

    const existing = org.members.map(m => m.profile.id);
    const all = org.circles.flatMap(c => c.users.map(u => u?.profile?.id));
    const missing = fp.uniq(fp.difference(all, existing));

    return client.mutate(
      {
        insert_org_members: [
          { objects: missing.map(id => ({ profile_id: id, org_id: orgId })) },
          { affected_rows: true },
        ],
      },
      { operationName: 'repl_insertOrgMembers' }
    );
  };

  const createMembersForAllOrgs = async () => {
    // TODO
    const { organizations } = await client.query(
      { organizations: [{}, { id: true, name: true }] },
      { operationName: 'repl_getOrgs' }
    );

    for (const org of organizations) {
      console.log(`${org.id}: ${org.name}`);
      await createMembersForOrg(org.id);
    }
  };

  return {
    createMembersForOrg,
    createMembersForAllOrgs,
  };
};
