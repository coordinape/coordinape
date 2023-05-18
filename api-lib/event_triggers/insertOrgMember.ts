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
    const insertedUser = payload.event.data.new;

    // if the user is deleted, do nothing
    if (insertedUser.deleted_at) {
      res.status(200).json({ message: 'no change' });
      return;
    }

    // check if this user exists as an org_member
    const { users_by_pk: user } = await adminClient.query(
      {
        users_by_pk: [
          { id: insertedUser.id },
          {
            profile: {
              id: true,
              org_members: [
                {
                  where: {
                    organization: {
                      circles: { users: { id: { _eq: insertedUser.id } } },
                    },
                  },
                },
                { deleted_at: true, org_id: true },
              ],
            },
            circle: { organization_id: true },
          },
        ],
      },
      { operationName: 'insertOrgMember_getOrgMember' }
    );

    const member = user?.profile?.org_members[0];

    // create org_member, or clear deleted_at if it already exists
    if (!member || member.deleted_at) {
      await adminClient.mutate(
        {
          insert_org_members_one: [
            {
              object: {
                profile_id: user?.profile?.id,
                org_id: user?.circle?.organization_id,
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
    res.status(200).json({ message: 'org_members table updated' });
  } catch (e) {
    res.status(500).json({
      error: '500',
      message: (e as Error).message || 'Unexpected error',
    });
  }
}
