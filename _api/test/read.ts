import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import type { VercelRequest, VercelResponse } from '@vercel/node';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const text = readFileSync(join(__dirname, './log.txt'), 'utf-8');

export default async function handler(req: VercelRequest, res: VercelResponse) {
  return res.status(200).json({ name: text.split(' ')[0] });
}
