import assert from 'assert';

import { GraphQLTypes } from '../../api-lib/gql/__generated__/zeus';
import { Role } from '../../src/lib/users';

import { createCircle } from './circles';
import type { GQLClientType } from './common';
import { createProfile } from './profiles';

export async function createUser(
  client: GQLClientType,
  object?: Partial<GraphQLTypes['users_insert_input']>
) {
  if (!object) object = {};

  if (!object.address) {
    const profile = await createProfile(client);
    object.address = profile.address;
  }

  if (!object.circle && !object.circle_id) {
    const circle = await createCircle(client);
    object.circle_id = circle.id;
  }

  const { insert_users_one: user } = await client.mutate(
    {
      insert_users_one: [
        {
          object: {
            ...object,
            // FIXME this should be MEMBER, but lots of tests rely on this
            role: object.role ?? Role.ADMIN,
            starting_tokens: object.starting_tokens ?? 100,
            entrance: object.entrance ?? '?',
          },
        },
        {
          id: true,
          address: true,
          circle_id: true,
          role: true,
          profile: { id: true, address: true, name: true },
          circle: {
            id: true,
            name: true,
            organization: { id: true, name: true },
          },
        },
      ],
    },
    { operationName: 'createUser' }
  );

  assert(user, 'User not created');

  const { org_members } = await client.query(
    {
      org_members: [
        {
          where: {
            _and: [
              { org_id: { _eq: user?.circle?.organization.id } },
              { profile_id: { _eq: user?.profile?.id } },
            ],
          },
        },
        { id: true, org_id: true },
      ],
    },
    { operationName: 'orgMemberHelper_getExistingMembers' }
  );
  const orgMember = org_members.pop();
  if (!orgMember) {
    const { insert_org_members_one: orgMember } = await client.mutate(
      {
        insert_org_members_one: [
          {
            object: {
              profile_id: user?.profile?.id,
              org_id: user?.circle?.organization.id,
              deleted_at: null,
            },
          },
          { id: true },
        ],
      },
      { operationName: 'createUserHelper_insertOrgMember' }
    );
    assert(orgMember, 'Org membership not created');
  }

  return user;
}
