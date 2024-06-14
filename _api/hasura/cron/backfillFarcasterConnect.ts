import type { VercelRequest, VercelResponse } from '@vercel/node';

import { IS_LOCAL_ENV } from '../../../api-lib/config.ts';
import { autoConnectFarcasterAccount } from '../../../api-lib/farcaster/autoConnectFarcasterAccount.ts';
import {
  order_by,
  profile_flags_constraint,
  profile_flags_update_column,
} from '../../../api-lib/gql/__generated__/zeus';
import { adminClient } from '../../../api-lib/gql/adminClient';
import { verifyHasuraRequestMiddleware } from '../../../api-lib/validate';

const BATCH_SIZE = 20;

async function handler(_req: VercelRequest, res: VercelResponse) {
  if (IS_LOCAL_ENV) {
    return res.status(200).json({
      message: 'This endpoint is disabled in local environment.',
    });
  }

  // get profiles without reputation
  const { profiles } = await adminClient.query(
    {
      profiles: [
        {
          limit: BATCH_SIZE,
          order_by: [{ id: order_by.asc }],
          where: {
            _not: {
              farcaster_account: {},
            },
            _or: [
              {
                _not: {
                  profile_flags: {},
                },
              },
              {
                profile_flags: {
                  farcaster_connect_checked_at: {
                    _is_null: true,
                  },
                },
              },
            ],
          },
        },
        {
          id: true,
          address: true,
        },
      ],
    },
    {
      operationName: 'getProfilesForFarcasterBackfill',
    }
  );

  if (profiles.length > 0) {
    // eslint-disable-next-line no-console
    console.log(
      `updating farcaster connect for ${profiles.length} profiles starting at id ${profiles[0]?.id}`
    );
    // Update the batch in parallel
    const results = await Promise.allSettled(
      profiles.map(p => autoConnectFarcasterAccount(p.address, p.id))
    );

    const profilesIncludingErrors = profiles.map((p, index) => {
      const result = results[index];
      let error: string | undefined;
      if (result.status !== 'fulfilled') {
        error = result.reason;
      }
      return {
        profile_id: p.id,
        farcaster_connect_checked_at: 'now()',
        farcaster_connect_error: error,
      };
    });

    // Mark all of these as checked
    await adminClient.mutate(
      {
        insert_profile_flags: [
          {
            objects: profilesIncludingErrors,
            on_conflict: {
              constraint: profile_flags_constraint.profile_flags_pkey,
              update_columns: [
                profile_flags_update_column.farcaster_connect_checked_at,
              ],
            },
          },
          {
            affected_rows: true,
          },
        ],
      },
      {
        operationName: 'updateFarcasterConnectCheckedAt',
      }
    );

    // eslint-disable-next-line no-console
    console.log(
      `updated farcaster connect for ${profiles.length} profiles starting at id ${profiles[0]?.id}`
    );
  } else {
    // eslint-disable-next-line no-console
    console.log('no profiles need farcaster connect update');
  }

  res.status(200).json({
    success: true,
  });
}

export default verifyHasuraRequestMiddleware(handler);
