import type { VercelRequest, VercelResponse } from '@vercel/node';
import { generateNonce } from 'siwe';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // TODO: might want to save the generated nonce and verify against it
  res.status(200).send({
    nonce: generateNonce(),
    time: Date.now(),
  });
}
