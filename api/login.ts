import assert from 'assert';
import { randomBytes, createHash } from 'crypto';

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { DateTime, Settings } from 'luxon';

import { adminClient } from '../api-lib/gql/adminClient';
import { errorResponse } from '../api-lib/HttpError';
import {
  parseInput,
  verifyContractSignature,
  verifySignature,
} from '../api-lib/signature';

Settings.defaultZone = 'utc';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const input = parseInput(req);

    try {
      const verificationResult = input.hash.length
        ? await verifyContractSignature(input)
        : verifySignature(input);
      if (!verificationResult) {
        return errorResponse(res, {
          message: 'invalid signature',
          httpStatus: 401,
        });
      }
    } catch (e: unknown) {
      return errorResponse(res, {
        message: 'invalid signature: ' + e,
        httpStatus: 401,
      });
    }

    const { profiles } = await adminClient.query(
      {
        profiles: [
          { where: { address: { _ilike: input.address } } },
          { id: true },
        ],
      },
      {
        operationName: 'login-getProfile',
      }
    );

    let profile = profiles.pop();
    const tokenString = generateTokenString();

    if (!profile) {
      const { insert_profiles_one } = await adminClient.mutate(
        {
          insert_profiles_one: [
            { object: { address: input.address } },
            { id: true },
          ],
        },
        {
          operationName: 'login-insertProfile',
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
            { where: { profile: { address: { _ilike: input.address } } } },
            { affected_rows: true },
          ],
          insert_personal_access_tokens_one: [
            {
              object: {
                name: 'circle-access-token',
                abilities: '["read"]',
                tokenable_type: 'App\\Models\\Profile',
                tokenable_id: profile.id,
                token: createHash('sha256').update(tokenString).digest('hex'),
                updated_at: now,
                created_at: now,
                last_used_at: now,
              },
            },
            { id: true },
          ],
        },
        {
          operationName: 'login-insertAccessToken',
        }
      );

    return res.status(200).json({ token: `${token?.id}|${tokenString}` });
  } catch (error: any) {
    errorResponse(res, error);
  }
}

function generateTokenString(len = 40): string {
  const bufSize = len * 2;
  if (bufSize > 65536) {
    const e = new Error();
    (e as any).code = 22;
    e.message = `Quota exceeded: requested ${bufSize} > 65536 bytes`;
    e.name = 'QuotaExceededError';
    throw e;
  }
  const candidateString = randomBytes(bufSize).toString('base64').slice(0, len);
  if (candidateString.includes('/') || candidateString.includes('+'))
    return generateTokenString(len);
  return candidateString;
}
