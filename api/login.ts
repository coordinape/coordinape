import assert from 'assert';

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { DateTime, Settings } from 'luxon';
import { SiweMessage, SiweErrorType } from 'siwe';

import {
  formatAuthHeader,
  generateTokenString,
  hashTokenString,
} from '../api-lib/authHelpers';
import { adminClient } from '../api-lib/gql/adminClient';
import { insertInteractionEvents } from '../api-lib/gql/mutations';
import { errorResponse } from '../api-lib/HttpError';
import { getProvider } from '../api-lib/provider';
import { parseInput } from '../api-lib/signature';

Settings.defaultZone = 'utc';

const allowedDomainsRegex = process.env.SIWE_ALLOWED_DOMAINS?.split(',').filter(
  item => item !== ''
) || ['localhost:3000'];

const allowedDomains = allowedDomainsRegex.map(item => new RegExp(item));

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const input = parseInput(req);

    const { data, signature } = input;

    let address;

    try {
      const message = new SiweMessage(data);

      if (
        !allowedDomains.find(allowedRegex => allowedRegex.test(message.domain))
      ) {
        return errorResponse(res, {
          message: 'invalid domain',
          httpStatus: 401,
        });
      }

      const siweProvider = getProvider(message.chainId);
      const verificationResult = await message.verify(
        {
          signature,
        },
        { provider: siweProvider }
      );

      if (!verificationResult.success) {
        return errorResponse(res, {
          message: 'invalid signature',
          httpStatus: 401,
        });
      }

      address = message.address.toLowerCase();
    } catch (e: any) {
      if (Object.values(SiweErrorType).some(val => val === e.error.type)) {
        return errorResponse(res, {
          message: 'SIWE error: ' + e.error.type,
          httpStatus: 401,
        });
      } else {
        // Return generic error for non-SIWE exceptions
        return errorResponse(res, {
          message: 'login error: ' + e,
          httpStatus: 401,
        });
      }
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
          insert_profiles_one: [
            { object: { address: address } },
            {
              id: true,
              users: [{}, { circle_id: true }],
            },
          ],
        },
        {
          operationName: 'login_insertProfile',
        }
      );
      assert(insert_profiles_one, "panic: adding profile didn't succeed");
      profile = insert_profiles_one;
      await insertInteractionEvents({
        event_type: 'first_login',
        profile_id: insert_profiles_one.id,
        circle_id: insert_profiles_one.users?.[0]?.circle_id,
        data: {
          invitedMember: insert_profiles_one.users
            ? insert_profiles_one.users.length > 0
            : false,
          brandNewMember: insert_profiles_one.users
            ? insert_profiles_one.users.length == 0
            : false,
        },
      });
      // if they have no users, this is a "clean signup"
    }
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

    await insertInteractionEvents({
      event_type: 'login',
      profile_id: profile.id,
    });
    return res
      .status(200)
      .json({ token: formatAuthHeader(token?.id, tokenString) });
  } catch (error: any) {
    errorResponse(res, error);
  }
}
