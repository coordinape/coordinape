import { VercelRequest, VercelResponse } from '@vercel/node';

import { handlerSafe } from '../../api-lib/handlerSafe';

import { generateAuthUrl, getProfileFromCookie } from './twitter';

async function handler(req: VercelRequest, res: VercelResponse) {
  const { page } = req.query;

  const { profile, state } = await getProfileFromCookie(req);
  if (!profile) {
    throw new Error(`Can't connect twitter, not logged in`);
  }

  const authUrl = generateAuthUrl(state, page ? (page as string) : undefined);
  // eslint-disable-next-line no-console
  console.log('redirect to authUrl', authUrl);
  return res.redirect(authUrl);
}

export default handlerSafe(handler);
