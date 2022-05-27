import assert from 'assert';

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { DateTime, Settings } from 'luxon';
import { SiweMessage } from 'siwe';

import {
  formatAuthHeader,
  generateTokenString,
  hashTokenString,
} from '../api-lib/authHelpers';
import { adminClient } from '../api-lib/gql/adminClient';
import { errorResponse } from '../api-lib/HttpError';
import { parseInput } from '../api-lib/signature';

Settings.defaultZone = 'utc';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const input = parseInput(req);

    const { data, signature } = input;

    let address;

    try {
      const message = new SiweMessage(data);

      // TODO: replace by configured domain
      // TODO: Include this in .env?
      const domain = 'localhost:3000';
      if (message.domain !== domain) {
        return errorResponse(res, {
          message: `domain in message doesnt match ${domain}`,
          httpStatus: 401,
        });
      }

      const verificationResult = await message.verify({
        signature,
        domain,
      });

      if (!verificationResult.success) {
        return errorResponse(res, {
          message: 'invalid signature',
          httpStatus: 401,
        });
      }

      address = message.address;
    } catch (e: unknown) {
      return errorResponse(res, {
        message: 'invalid signature: ' + e,
        httpStatus: 401,
      });
    }

    const { profiles } = await adminClient.query(
      {
        profiles: [{ where: { address: { _ilike: address } } }, { id: true }],
      },
      {
        operationName: 'login_getProfile',
      }
    );

    let profile = profiles.pop();
    const tokenString = generateTokenString();

    if (!profile) {
      const { insert_profiles_one } = await adminClient.mutate(
        {
          insert_profiles_one: [{ object: { address: address } }, { id: true }],
        },
        {
          operationName: 'login_insertProfile',
        }
      );
      profile = insert_profiles_one;
    }
    assert(profile, 'panic: profile must exist');

    const now = DateTime.now().toISO();

    const { insert_personal_access_tokens_one: token } =
      await adminClient.mutate(
        {
          delete_personal_access_tokens: [
            { where: { profile: { address: { _ilike: address } } } },
            { affected_rows: true },
          ],
          insert_personal_access_tokens_one: [
            {
              object: {
                name: 'circle-access-token',
                abilities: '["read"]',
                tokenable_type: 'App\\Models\\Profile',
                tokenable_id: profile.id,
                token: hashTokenString(tokenString),
                updated_at: now,
                created_at: now,
                last_used_at: now,
              },
            },
            { id: true },
          ],
        },
        {
          operationName: 'login_insertAccessToken',
        }
      );

    return res
      .status(200)
      .json({ token: formatAuthHeader(token?.id, tokenString) });
  } catch (error: any) {
    errorResponse(res, error);
  }
}
