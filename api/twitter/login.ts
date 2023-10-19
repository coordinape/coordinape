import { VercelRequest, VercelResponse } from '@vercel/node';

import { generateAuthUrl, getProfileFromCookie } from './twitter';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { profile, state } = await getProfileFromCookie(req);
  if (!profile) {
    throw new Error(`Can't connect twitter, not logged in`);
  }

  const authUrl = generateAuthUrl(state);
  res.redirect(authUrl);
}
