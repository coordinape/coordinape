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

const schema = z.object({
  token: z.string(),
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { token } = schema.parse(req.body);

    // eslint-disable-next-line no-console
    console.log('tokenLogin', token);

    const { update_profiles } = await adminClient.mutate(
      {
        update_profiles: [
          {
            where: {
              device_login_token: { _eq: token },
            },
            _set: {
              device_login_token: null,
            },
          },
          {
            affected_rows: true,
            returning: { id: true, address: true },
          },
        ],
      },
      { operationName: 'tokenLogin_getProfile' }
    );

    const affected_rows = update_profiles?.affected_rows;
    const profile = update_profiles?.returning[0];

    if (affected_rows !== 1 || !profile) {
      return res.status(401).json({ message: 'failed to authenticate' });
    }

    const tokenString = generateTokenString();
    const now = DateTime.now().toISO();

    const { insert_personal_access_tokens_one: access_token } =
      await adminClient.mutate(
        {
          insert_personal_access_tokens_one: [
            {
              object: {
                name: 'non-wallet-access-token',
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
        { operationName: 'tokenLogin_insertAccessToken' }
      );

    return res.status(200).json({
      token: formatAuthHeader(access_token?.id, tokenString),
      id: profile.id,
      address: profile.address,
    });
  } catch (error: any) {
    return errorResponse(res, error);
  }
}
