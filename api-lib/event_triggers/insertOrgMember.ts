import assert from 'assert';

import type { VercelRequest, VercelResponse } from '@vercel/node';

import {
  org_members_constraint,
  org_members_update_column,
} from '../gql/__generated__/zeus';
import { adminClient } from '../gql/adminClient';
import { EventTriggerPayload } from '../types';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const payload: EventTriggerPayload<'users', 'INSERT' | 'UPDATE'> = req.body;
    const user = payload.event.data.new;
    const query = await adminClient.query(
      {
        circles_by_pk: [{ id: user.circle_id }, { organization_id: true }],
        profiles: [
          { where: { address: { _ilike: user.address } }, limit: 1 },
          { id: true, address: true },
        ],
      },
      { operationName: 'insertOrgMember_getUserIds' }
    );
    assert(query.circles_by_pk);
    //check if this user exists as an org_member
    const { org_members } = await adminClient.query(
      {
        org_members: [
          {
            where: {
              _and: [
                { org_id: { _eq: query.circles_by_pk?.organization_id } },
                { profile_id: { _eq: query.profiles[0].id } },
              ],
            },
          },
          { id: true, deleted_at: true },
        ],
      },
      { operationName: 'insertOrgMember_getOrgMember' }
    );

    if (user.deleted_at === null) {
      if (!org_members[0] || org_members[0].deleted_at !== null) {
        adminClient.mutate(
          {
            insert_org_members_one: [
              {
                object: {
                  profile_id: query.profiles[0].id,
                  org_id: query.circles_by_pk?.organization_id,
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
          { operationName: 'insertOrgMember_insertMember' }
        );
      }
    }
    res.status(200).json({ message: `org_members table updated` });
  } catch (e) {
    res.status(500).json({
      error: '500',
      message: (e as Error).message || 'Unexpected error',
    });
  }
}
