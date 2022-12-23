import assert from 'assert';

import type { VercelRequest, VercelResponse } from '@vercel/node';

import { parseAuthHeader } from '../../api-lib/authHelpers';
import {
  HASURA_DISCORD_SECRET,
  IS_LOCAL_ENV,
  IS_TEST_ENV,
} from '../../api-lib/config';
import { adminClient } from '../../api-lib/gql/adminClient';
import { isFeatureEnabled } from '../../src/config/features';

export const TEST_SKIP_AUTH = 'test-skip-auth';

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

    if (
      isFeatureEnabled('discord') &&
      req.headers?.authorization === HASURA_DISCORD_SECRET
    ) {
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
            {
              hash: tokenHash,
            },
            {
              hash: true,
              circle_id: true,
            },
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
    const tokenRow = await adminClient.query(
      {
        personal_access_tokens: [
          {
            where: {
              tokenable_type: { _eq: 'App\\Models\\Profile' },
              id: { _eq: prefix },
              token: { _eq: tokenHash },
            },
          },
          {
            tokenable_id: true,
            profile: {
              address: true,
            },
          },
        ],
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
