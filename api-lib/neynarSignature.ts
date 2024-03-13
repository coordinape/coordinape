/* eslint-disable no-console */
import assert from 'assert';
import { createHmac } from 'crypto';
import type { Readable } from 'node:stream';

import { VercelRequest } from '@vercel/node';

export async function isValidSignature(
  req: VercelRequest // must be VercelRequest object, we then properly parse the buffer into a raw string body for the hmac
): Promise<boolean> {
  const signature = req.headers['x-neynar-signature'] as string;
  assert(signature, 'Missing signature');

  const webhookSecret = process.env.NEYNAR_WEBHOOK_SECRET as string;
  assert(webhookSecret, 'Missing neynar webhook secret');

  // const bod = req.body;
  // console.log({ bod_json: JSON.stringify(bod) });

  const rawBody = await parseRawBody(req);
  // console.log({ rawBody });
  assert(rawBody, 'isValidSignature failed to construct a body from request.');

  const hmac = createHmac('sha512', webhookSecret); // Create a HMAC SHA256 hash using the signing key
  hmac.update(rawBody); // Update the token hash with the request body using utf8
  const digest = hmac.digest('hex');
  return signature === digest;
}

const parseRawBody = async (req: VercelRequest) => {
  let buf, rawBody;
  if (req.method === 'POST') {
    buf = await buffer(req);
    rawBody = buf.toString('utf8');
    // console.log({ buf, rawBody });
  } else {
    // eslint-disable-next-line no-console
    // console.log('req method not POST, got:', req.method);
  }
  assert(rawBody, 'parseRawBody failed to construct a body from request.');
  return rawBody;
};

async function buffer(readable: Readable) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}
