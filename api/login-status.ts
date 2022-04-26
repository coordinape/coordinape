import type { VercelRequest, VercelResponse } from '@vercel/node';

import { getUserByToken } from '../api-lib/login';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  let loggedIn = false;
  try {
    await getUserByToken(req);
    loggedIn = true;
  } catch (_) {} // eslint-disable-line

  res.status(200).json({ loggedIn });
}
