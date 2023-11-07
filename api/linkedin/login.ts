import { VercelRequest, VercelResponse } from '@vercel/node';

import { handlerSafe } from '../../api-lib/handlerSafe';
import { getProfileFromCookie } from '../twitter/twitter';

import { generateAuthURL } from './linkedin';

async function handler(req: VercelRequest, res: VercelResponse) {
  const { profile, state } = await getProfileFromCookie(req);
  if (!profile) {
    throw new Error(`Can't connect linkedin, not logged in`);
  }

  const url = await generateAuthURL(state);
  return res.redirect(url);
}

export default handlerSafe(handler);
