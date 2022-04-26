import assert from 'assert';
import crypto from 'crypto';

import type { VercelRequest } from '@vercel/node';

import { adminClient } from './gql/adminClient';

export const getUserByToken = async (req: VercelRequest) => {
  assert(req.headers?.authorization, 'No token was provided');
  const [expectedId, token] = req.headers.authorization
    .replace('Bearer ', '')
    .split('|');
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  const tokenRow = await adminClient.query({
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
      },
    ],
  });
  const tokenableId = tokenRow.personal_access_tokens[0]?.tokenable_id;
  assert(tokenableId, 'The token provided was not recognized');
  return tokenableId;
};
