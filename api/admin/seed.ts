import type { VercelRequest, VercelResponse } from '@vercel/node';
import { prepass } from 'gqty';

import { mutation, axios, resolved } from '../../src/lib/gqty';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // TODO: This shouldn't run in production
  console.log('|');
  console.log('|');
  console.log('|');
  console.log('|');
  console.log('HANDLING IT');

  const interceptor = axios.interceptors.request.use(config => {
    config.headers['x-hasura-admin-secret'] = process.env.TESTING_AUTH_TOKEN;
    return config;
  });

  try {
    const resp = await resolved(() => {
      const result = mutation.insert_profiles_one({
        object: {
          address: '0x2',
          admin_view: false,
          ann_power: false,
          bio: 'hi',
          // avatar:
          // background:
          // chat_id:
          // discord_username:
          // github_username:
          // medium_username:
          // skills:
          // telegram_username:
          // twitter_username:
          // website:
        },
      });

      return result;
    });

    console.log('prepass', resp);
    const wBio = await resolved(() => prepass(resp, 'bio')).catch(e =>
      console.error('EEERRRRR:', e)
    );

    // TODO: Why doesn't gqty show me my varaibles?
    // Why does this show as null?
    console.log('wBio', wBio);

    res.status(200).json({
      hi: 'hei',
      resp, // {}
      bio: resp.bio, // undefined
      wBio, // undefined
    });
  } catch (e) {
    console.error('API ERROR', e);
    res.status(501).json({
      error: '501',
      message: 'Server Error',
    });
  } finally {
    axios.interceptors.request.eject(interceptor);
  }
}
