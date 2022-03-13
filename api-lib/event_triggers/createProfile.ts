import type { VercelRequest, VercelResponse } from '@vercel/node';

import { profiles_constraint } from '../gql/__generated__/zeus';
import { adminClient } from '../gql/adminClient';
import { EventTriggerPayload } from '../types';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const {
    event: { data },
  }: EventTriggerPayload<'users', 'UPDATE' | 'INSERT'> = req.body;

  try {
    if (data.old?.address !== data.new.address) {
      const { insert_profiles_one } = await adminClient.mutate({
        // Create a profile if none exists yet
        insert_profiles_one: [
          {
            object: { address: data.new.address },

            // This clause allows gql to catch the conflict and do nothing
            // hasura calls this an "upsert"
            on_conflict: {
              constraint: profiles_constraint.profiles_address_key,
              // Don't update the entry at all if a profile exists
              // Don't want to touch the timestamp if we aren't actually
              // modifying anything
              update_columns: [],
            },
          },
          {
            address: true,
          },
        ],
      });
      if (insert_profiles_one) {
        res.status(200).json({
          message: `profile created for ${insert_profiles_one.address}`,
        });
        return;
      }
      res
        .status(200)
        .json({ message: `profile exists for ${data.new.address}` });
    }
  } catch (e) {
    res.status(500).json({
      error: '500',
      message: (e as Error).message || 'Unexpected error',
    });
  }
}
