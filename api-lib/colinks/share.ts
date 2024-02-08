import { createHmac } from 'crypto';

import { HMAC_SECRET } from '../config';
import { UnauthorizedError } from '../HttpError';

const LENGTH = 20;

export function genToken(profileId: string, activityId: string): string {
  const token = genHmac(profileId, activityId);

  const params = new URLSearchParams({
    s: token.slice(0, LENGTH),
  });
  return params.toString();
}

export function decodeToken(
  token: string,
  profileId: string,
  activityId: string
): {
  profileId: string;
  activityId: string;
} {
  if (!profileId || !activityId || !token) {
    throw new UnauthorizedError('Invalid token');
  }

  const generatedToken = genHmac(profileId, activityId);

  // eslint-disable-next-line no-console
  console.log({ token, generatedToken: generatedToken.slice(0, LENGTH) });

  if (token !== generatedToken.slice(0, LENGTH)) {
    throw new UnauthorizedError('Invalid token');
  }
  return { profileId, activityId };
}

function genHmac(profileId: string, activityId: string): string {
  const data = `${profileId}:${activityId}`;
  return createHmac('sha256', HMAC_SECRET).update(data).digest('hex');
}
