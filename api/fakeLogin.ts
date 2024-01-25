import { VercelRequest, VercelResponse } from '@vercel/node';
import { DateTime } from 'luxon';
import { z } from 'zod';

import {
  formatAuthHeader,
  generateTokenString,
  hashTokenString,
} from '../api-lib/authHelpers';
import { adminClient } from '../api-lib/gql/adminClient';
import { errorResponse } from '../api-lib/HttpError';

export function parseInput(req: VercelRequest) {
  const parsed = z
    .object({
      input: z.object({ payload: z.object({ profileId: z.number() }) }),
    })
    .parse(req.body);
  return parsed.input.payload;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const input = parseInput(req);
    const { profileId } = input;
    const { profiles } = await adminClient.query(
      {
        profiles: [
          { where: { id: { _eq: profileId } } },
          { id: true, connector: true, address: true },
        ],
      },
      { operationName: 'login_getProfile' }
    );

    const profile = profiles.pop();
    const tokenString = generateTokenString();

    if (!profile) {
      return res.status(404).json({ message: 'profile not found' });
    }
    const now = DateTime.now().toISO();

    const { insert_personal_access_tokens_one: token } =
      await adminClient.mutate(
        {
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
        { operationName: 'login_insertAccessToken' }
      );

    return res.status(200).json({
      token: formatAuthHeader(token?.id, tokenString),
      id: profile.id,
      address: profile.address,
    });
  } catch (error: any) {
    return errorResponse(res, error);
  }
}
