import assert from 'assert';
import crypto from 'crypto';

import type { VercelRequest, VercelResponse } from '@vercel/node';

import { IS_LOCAL_ENV } from '../../api-lib/config';
import { adminClient } from '../../api-lib/gql/adminClient';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (IS_LOCAL_ENV && req.headers?.authorization === 'generate') {
      // For generating libraries from inspection
      res.status(200).json({
        'X-Hasura-Role': req.headers?.['x-hasura-role'],
      });
      return;
    }

    assert(req.headers?.authorization, 'No token was provided');
    const [expectedId, token] = req.headers.authorization
      .replace('Bearer ', '')
      .split('|');
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const tokenRow = await adminClient.query(
      {
        personal_access_tokens: [
          {
            where: {
              tokenable_type: { _eq: 'App\\Models\\Profile' },
              id: { _eq: parseInt(expectedId) },
              token: { _eq: hashedToken },
            },
          },
          {
            tokenable_id: true,
            profile: {
              address: true,
            },
          },
        ],
        // cache query with ttl of 30s
      },
      { operationName: 'auth_getToken @cached(ttl: 30)' }
    );

    const tokenableId = tokenRow.personal_access_tokens[0]?.tokenable_id;
    assert(tokenableId, 'The token provided was not recognized');

    const profile = tokenRow.personal_access_tokens[0]?.profile;
    assert(profile, 'Profile cannot be found');

    res.status(200).json({
      'X-Hasura-User-Id': tokenableId.toString(),
      'X-Hasura-Role': 'user',
      'X-Hasura-Address': profile.address,
    });
  } catch (e) {
    res.status(401).json({
      error: '401',
      message: (e as Error).message || 'Unexpected error',
    });
  }
}
