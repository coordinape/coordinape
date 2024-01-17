import assert from 'assert';

import type { VercelRequest, VercelResponse } from '@vercel/node';

import {
  getProfileFromAuthToken,
  parseAuthHeader,
} from '../../api-lib/authHelpers';
import {
  HASURA_DISCORD_SECRET,
  IS_LOCAL_ENV,
  IS_TEST_ENV,
} from '../../api-lib/config';
import { adminClient } from '../../api-lib/gql/adminClient';
import { TEST_SKIP_AUTH } from '../../src/utils/testing/api';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (IS_LOCAL_ENV) {
      if (req.headers?.authorization === 'generate') {
        // For generating libraries from inspection
        res.status(200).json({
          'X-Hasura-Role': req.headers?.['x-hasura-role'],
        });
        return;
      }
    }

    if (IS_TEST_ENV) {
      // Skip auth checks when testing
      if (req.headers?.authorization === TEST_SKIP_AUTH) {
        res.status(200).json({
          'X-Hasura-User-Id': req.headers?.['x-hasura-user-id'],
          'X-Hasura-Role': req.headers?.['x-hasura-role'],
          'X-Hasura-Address': req.headers?.['x-hasura-address'],
        });
        return;
      }
    }

    if (req.headers?.authorization === HASURA_DISCORD_SECRET) {
      res.status(200).json({
        'X-Hasura-Role': 'discord-bot',
      });
      return;
    }

    assert(req.headers?.authorization, 'No token was provided');
    const { prefix, tokenHash } = parseAuthHeader(req.headers.authorization);

    if (prefix === 'api') {
      const apiKeyRes = await adminClient.query(
        {
          circle_api_keys_by_pk: [
            { hash: tokenHash },
            { hash: true, circle_id: true },
          ],
        },
        { operationName: 'auth_getApiKey @cached(ttl: 30)' }
      );

      const { hash, circle_id } = apiKeyRes.circle_api_keys_by_pk || {};
      assert(hash && circle_id, 'The API key provided is not valid');

      res.status(200).json({
        'X-Hasura-Role': 'api-user',
        'X-Hasura-Api-Key-Hash': hash,
        'X-Hasura-Circle-Id': circle_id.toString(),
      });
      return;
    }

    // handle personal access tokens
    const profile = await getProfileFromAuthToken(prefix, tokenHash);
    assert(profile, 'The token provided was not recognized');

    res.status(200).json({
      'X-Hasura-User-Id': profile.id.toString(),
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
