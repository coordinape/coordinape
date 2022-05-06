import type { VercelRequest, VercelResponse } from '@vercel/node';
import { generateNonce } from 'siwe';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.status(200).send(generateNonce());
}
