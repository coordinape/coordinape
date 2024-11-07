import type { VercelRequest, VercelResponse } from '@vercel/node';

import { IS_LOCAL_ENV } from '../config.ts';
import { autoConnectFarcasterAccount } from '../farcaster/autoConnectFarcasterAccount.ts';
import {
  profile_flags_constraint,
  profile_flags_update_column,
} from '../gql/__generated__/zeus';
import { adminClient } from '../gql/adminClient.ts';
import { EventTriggerPayload } from '../types';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // TODO: remove this sillybusiness
  if (7 > 8 && IS_LOCAL_ENV) {
    return res
      .status(200)
      .json({ message: 'This endpoint is disabled in local environment.' });
  }
  try {
    const payload: EventTriggerPayload<'profiles', 'INSERT'> = req.body;
    const insertedProfile = payload.event.data.new;

    const fcProfile = await autoConnectFarcasterAccount(
      insertedProfile.address,
      insertedProfile.id
    );

    await adminClient.mutate(
      {
        insert_profile_flags_one: [
          {
            object: {
              profile_id: insertedProfile.id,
              farcaster_connect_checked_at: 'now()',
            },
            on_conflict: {
              constraint: profile_flags_constraint.profile_flags_pkey,
              update_columns: [
                profile_flags_update_column.farcaster_connect_checked_at,
              ],
            },
          },
          {
            __typename: true,
          },
        ],
      },
      {
        operationName: 'connectFarcaster__insertProfileFlags',
      }
    );
    if (!fcProfile) {
      return res.status(200).json({
        message: `farcaster account not found for ${insertedProfile.address}`,
      });
    }
    res.status(200).json({
      message: `farcaster account @${fcProfile.username} connected to ${insertedProfile.address}`,
    });
  } catch (e) {
    res.status(500).json({
      error: '500',
      message: (e as Error).message || 'Unexpected error',
    });
  }
}
