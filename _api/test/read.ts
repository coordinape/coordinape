import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import type { VercelRequest, VercelResponse } from '@vercel/node';

import { IN_DEVELOPMENT } from '../../src/config/env';

let text: string;
if (!IN_DEVELOPMENT) {
  text = readFileSync(join(__dirname, './log.txt'), 'utf-8');
} else {
  const currentFilename = fileURLToPath(import.meta.url);
  const currentDirname = dirname(currentFilename);
  text = readFileSync(join(currentDirname, './log.txt'), 'utf-8');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  return res.status(200).json({ name: text.split(' ')[0] });
}
