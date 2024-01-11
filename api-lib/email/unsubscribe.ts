import { createHmac } from 'crypto';

import { HMAC_SECRET } from '../config';
import { UnauthorizedError } from '../HttpError';

export function genToken(profileId: string, email: string): string {
  const token = genHmac(profileId, email);

  const params = new URLSearchParams({ profileId, email, token });
  return params.toString();
}

export function decodeToken(encodedString: string): {
  profileId: string;
  email: string;
} {
  const params = new URLSearchParams(encodedString);
  const profileId = params.get('profileId');
  const email = params.get('email');
  const token = params.get('token');

  if (!profileId || !email || !token) {
    throw new UnauthorizedError('Invalid unsubscribe token');
  }

  const generatedToken = genHmac(profileId, email);
  if (token !== generatedToken) {
    throw new UnauthorizedError('Invalid unsubscribe token');
  }
  return { profileId, email };
}

function genHmac(profileId: string, email: string): string {
  const data = `${profileId}:${email}`;
  return createHmac('sha256', HMAC_SECRET).update(data).digest('hex');
}
