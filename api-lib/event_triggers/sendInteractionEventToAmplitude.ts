import * as crypto from 'crypto';

import { init } from '@amplitude/node';
import type { VercelRequest, VercelResponse } from '@vercel/node';

import { AMPLITUDE_API_KEY } from '../config';
import { errorResponse } from '../HttpError';
import { EventTriggerPayload } from '../types';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (AMPLITUDE_API_KEY == '') {
      throw new Error(`AMPLITUDE_API_KEY not set`);
    }

    const payload: EventTriggerPayload<'interaction_events', 'INSERT'> =
      req.body;
    const client = init(AMPLITUDE_API_KEY);
    const { new: event } = payload.event.data;

    if (event.profile_id) {
      await client.logEvent({
        event_type: event.event_type,
        user_id: 'profile_' + sha256(`${event.profile_id}`),
        event_properties: {
          event_subtype: event.event_subtype,
          id: event.id,
          profile_id: event.profile_id,
          org_id: event.org_id,
          ...(event.data ?? {}),
        },
      });
    }

    if (event.circle_id) {
      await client.logEvent({
        event_type: `circle_${event.event_type}`,
        user_id: `circle_${event.circle_id}`,
        event_properties: {
          event_subtype: event.event_subtype,
          id: event.id,
          circle_id: event.circle_id,
          profile: event.profile_id ? sha256(`${event.profile_id}`) : undefined,
          profile_id: event.profile_id
            ? sha256(`${event.profile_id}`)
            : undefined,
          org_id: event.org_id,
          ...(event.data ?? {}),
        },
      });
    }

    res.status(200).json({
      message: `user event recorded`,
    });
  } catch (e) {
    return errorResponse(res, e);
  }
}

const sha256 = (input: string) =>
  crypto.createHash('sha256').update(input).digest('base64');
