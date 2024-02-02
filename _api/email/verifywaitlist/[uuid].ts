import type { VercelRequest, VercelResponse } from '@vercel/node';

import { verifyEmail } from '../verify/[uuid]';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  return await verifyEmail(req, res, true);
}
