import assert from 'assert';

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';

import {
  getProfileFromAuthToken,
  hashTokenString,
} from '../api-lib/authHelpers';
import { addPropsAndTrack } from '../api-lib/event_triggers/sendInteractionEventToMixpanel';
import { normalizePath } from '../src/features/analytics';

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

    if (!auth) {
      res.status(400).json({ ok: false, message: 'missing auth' });
      return;
    }

    const [id, token] = auth.split('|');
    assert(id !== 'api', 'no support for API tokens');
    const profile = await getProfileFromAuthToken(
      Number(id),
      hashTokenString(token)
    );

    if (!profile) {
      res.status(401).json({ ok: false, message: 'invalid auth' });
      return;
    }
    assert(profile, 'Invalid authorization token');

    await addPropsAndTrack({
      profile_id: profile.id,
      event_type: 'pageview',
      created_at: new Date(),
      id: 0,
      data: {
        path: normalizePath(location.pathname),
        original_path: location.pathname,
      },
    });

    res.status(200).json({ ok: true });
  } catch (err: any) {
    res.status(500).json({ ok: false, message: err.message });
  }
}
