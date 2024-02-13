import { createHmac } from 'crypto';

import { HMAC_SECRET } from '../config';
import { UnauthorizedError } from '../HttpError';

type EmailType =
  | 'give_happenings'
  | 'colinks_happenings'
  | 'circle_notification'
  | 'notification'; // for colinks notifications. remainded this way to not affect old links

export function isEmailType(emailType: string): emailType is EmailType {
  return [
    'give_happenings',
    'colinks_happenings',
    'circle_notification',
    'notification',
  ].includes(emailType);
}

export function genToken(
  profileId: string,
  email: string,
  emailType: EmailType
): string {
  const token = genHmac(profileId, email, emailType);

  const params = new URLSearchParams({
    profileId,
    email: encodeURIComponent(email),
    emailType,
    token,
  });
  return params.toString();
}

export function decodeToken(encodedString: string): {
  profileId: string;
  email: string;
  emailType: EmailType;
} {
  const params = new URLSearchParams(encodedString);
  const profileId = params.get('profileId');
  const email = decodeURIComponent(params.get('email') || '');
  const token = params.get('token');
  const emailType = params.get('emailType');

  if (!profileId || !email || !token || !emailType || !isEmailType(emailType)) {
    throw new UnauthorizedError('Invalid unsubscribe token');
  }

  const generatedToken = genHmac(profileId, email, emailType);

  if (token !== generatedToken) {
    throw new UnauthorizedError('Invalid unsubscribe token');
  }
  return { profileId, email, emailType };
}

function genHmac(profileId: string, email: string, emailType: string): string {
  const data = `${profileId}:${email}:${emailType}`;
  return createHmac('sha256', HMAC_SECRET).update(data).digest('hex');
}
