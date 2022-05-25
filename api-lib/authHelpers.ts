import { createHash, randomBytes } from 'crypto';

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

export function formatAuthHeader(prefix: string, tokenString: string): string {
  return `${prefix}|${tokenString}`;
}

export function parseAuthHeader(header: string): {
  prefix: string;
  tokenHash: string;
} {
  const [prefix, tokenString] = header.replace('Bearer ', '').split('|');

  const tokenHash = hashTokenString(tokenString);

  return { prefix, tokenHash };
}
