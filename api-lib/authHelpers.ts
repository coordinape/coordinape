import { createHash, randomBytes } from 'crypto';

import { adminClient } from './gql/adminClient';

export type AuthHeaderPrefix = 'api' | number;

export function generateTokenString(len = 40): string {
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

export function hashTokenString(tokenString: string): string {
  return createHash('sha256').update(tokenString).digest('hex');
}

export function formatAuthHeader(
  prefix: AuthHeaderPrefix,
  tokenString: string
): string {
  return `${prefix}|${tokenString}`;
}

export function parseAuthHeader(header: string): {
  prefix: AuthHeaderPrefix;
  tokenHash: string;
} {
  const [prefix, tokenString] = header.replace('Bearer ', '').split('|');

  const tokenHash = hashTokenString(tokenString);

  return {
    prefix: prefix === 'api' ? prefix : Number.parseInt(prefix, 10),
    tokenHash,
  };
}

export async function getCircleApiKey(hash: string) {
  const apiKeyRes = await adminClient.query(
    {
      circle_api_keys_by_pk: [
        {
          hash,
        },
        {
          hash: true,
          circle_id: true,
          name: true,
          create_vouches: true,
          read_pending_token_gifts: true,
          read_nominees: true,
          read_member_profiles: true,
          read_epochs: true,
          read_circle: true,
          update_pending_token_gifts: true,
          update_circle: true,
        },
      ],
    },
    { operationName: 'getCircleApiKey @cached(ttl: 60)' }
  );

  return apiKeyRes.circle_api_keys_by_pk;
}
