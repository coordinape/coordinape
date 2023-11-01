import type { VercelRequest, VercelResponse } from '@vercel/node';

import { generateEmbeddings } from '../../../api-lib/poap/generate-embeddings';
import { verifyHasuraRequestMiddleware } from '../../../api-lib/validate';
import { IN_DEVELOPMENT } from '../../../src/config/env';

async function handler(req: VercelRequest, res: VercelResponse) {
  // eslint-disable-next-line no-console
  console.log('cron generatePoapEmbeddings started');
  if (!IN_DEVELOPMENT) {
    // eslint-disable-next-line no-console
    console.log('running generatePoapEmbeddings');
    await generateEmbeddings();
  }

  res.status(200).json({
    success: true,
  });
}

export default verifyHasuraRequestMiddleware(handler);
