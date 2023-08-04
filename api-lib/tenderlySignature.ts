import { createHmac, timingSafeEqual } from 'crypto';

import { TENDERLY_WEBHOOK_SECRET } from './config';

export function isValidSignature(
  signature: string,
  body: string,
  timestamp: string
) {
  const signingKey = TENDERLY_WEBHOOK_SECRET;

  const hmac = createHmac('sha256', signingKey); // Create a HMAC SHA256 hash using the signing key
  hmac.update(body.toString(), 'utf8'); // Update the hash with the request body using utf8
  hmac.update(timestamp); // Update the hash with the request timestamp
  const digest = hmac.digest('hex');
  return timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
}
