import { createHmac } from 'crypto';

export function isValidSignatureForStringBody(
  body: string, // must be raw string body, not json transformed version of the body
  signature: string, // your "x-alchemy-signature" from header
  signingKey: string // taken from dashboard for specific webhook
): boolean {
  const hmac = createHmac('sha256', signingKey); // Create a HMAC SHA256 hash using the signing key
  hmac.update(body, 'utf8'); // Update the token hash with the request body using utf8
  const digest = hmac.digest('hex');
  return signature === digest;
}
