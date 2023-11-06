import { VercelRequest, VercelResponse } from '@vercel/node';

import { getProfileFromCookie } from '../twitter/twitter';

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID ?? '';
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { profile } = await getProfileFromCookie(req);
  if (!profile) {
    throw new Error(`Can't connect github, not logged in`);
  }
  res.redirect(
    `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}`
  );
}
