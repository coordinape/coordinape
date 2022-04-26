import assert from 'assert';

import type { VercelRequest, VercelResponse } from '@vercel/node';

import { IS_LOCAL_ENV } from '../../api-lib/config';
import { adminClient } from '../../api-lib/gql/adminClient';
import { getUserByToken } from '../../api-lib/login';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (IS_LOCAL_ENV && req.headers?.authorization === 'generate') {
      // For generating libraries from inspection
      res.status(200).json({
        'X-Hasura-Role': req.headers?.['x-hasura-role'],
      });
      return;
    }

    const tokenableId = await getUserByToken(req);

    const { profiles_by_pk: profile } = await adminClient.query({
      profiles_by_pk: [
        { id: tokenableId },
        { admin_view: true, address: true },
      ],
    });

    assert(profile, 'Profile cannot be found');

    const role =
      profile.admin_view && req.headers['X-Preferred-Role'] === 'superadmin'
        ? 'superadmin'
        : 'user';

    res.status(200).json({
      'X-Hasura-User-Id': tokenableId.toString(),
      'X-Hasura-Role': role,
      'X-Hasura-Address': profile.address,
    });
  } catch (e) {
    res.status(401).json({
      error: '401',
      message: (e as Error).message || 'Unexpected error',
    });
  }
}
