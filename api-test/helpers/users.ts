import assert from 'assert';

import {
  GraphQLTypes,
  org_members_constraint,
  org_members_update_column,
} from '../../api-lib/gql/__generated__/zeus';
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

  const { insert_org_members_one: orgMember } = await client.mutate(
    {
      insert_org_members_one: [
        {
          object: {
            profile_id: user?.profile?.id,
            org_id: user?.circle?.organization.id,
            deleted_at: null,
          },
          on_conflict: {
            constraint:
              org_members_constraint.org_members_profile_id_org_id_key,
            update_columns: [org_members_update_column.deleted_at],
            where: { deleted_at: { _is_null: false } },
          },
        },
        { id: true },
      ],
    },
    { operationName: 'createUserHelper_insertOrgMember' }
  );
  assert(orgMember, 'Org membership not created');

  return user;
}
