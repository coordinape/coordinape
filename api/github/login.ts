import { VercelRequest, VercelResponse } from '@vercel/node';
import { v4 } from 'uuid';

import { WEB_APP_BASE_URL } from '../../api-lib/config';
import { getProfileFromCookie } from '../twitter/twitter';

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID ?? '';
const SCOPES = 'user';
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { profile } = await getProfileFromCookie(req);
  if (!profile) {
    throw new Error(`Can't connect github, not logged in`);
  }

  res.redirect(
    `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${WEB_APP_BASE_URL}/api/github/callback&state=${v4()}&scope=${SCOPES}`
  );
}
