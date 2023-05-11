import assert from 'assert';

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';

import {
  getProfileFromAuthToken,
  hashTokenString,
} from '../api-lib/authHelpers';
import { addPropsAndTrack } from '../api-lib/event_triggers/sendInteractionEventToMixpanel';

const inputSchema = z.object({
  auth: z.string(),
  location: z.object({
    pathname: z.string(),
    search: z.string(),
    hash: z.string(),
  }),
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { location, auth } = inputSchema.parse(req.body);

    // replace numeric IDs, invite tokens, addresses with placeholders
    // so that they can be aggregated in reports
    const cleanedPath = location.pathname
      .replace(new RegExp('/[0-9]+(/|$)'), '/:number$1')
      .replace(new RegExp('/[a-f0-9-]{36}(/|$)'), '/:token$1')
      .replace(new RegExp('/0x[a-f0-9-]{40}(/|$)'), '/:address$1');

    let profile;

    if (auth === '') {
      // TODO track anon... how?
    } else {
      const [id, token] = auth.split('|');
      assert(id !== 'api', 'no support for API tokens');
      profile = await getProfileFromAuthToken(
        Number(id),
        hashTokenString(token)
      );
      assert(profile, 'Invalid authorization token');
      await addPropsAndTrack({
        profile_id: profile.id,
        event_type: 'pageview',
        created_at: new Date(),
        id: 0,
        data: {
          path: cleanedPath,
          original_path: location.pathname,
        },
      });
    }

    res.status(200).json({ ok: true });
  } catch (err: any) {
    res.status(500).json({ ok: false, message: err.message });
  }
}
