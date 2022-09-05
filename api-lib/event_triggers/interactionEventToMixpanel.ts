import * as crypto from 'crypto';

import type { VercelRequest, VercelResponse } from '@vercel/node';
import mixpanel, { Mixpanel } from 'mixpanel';

import { MIXPANEL_PROJECT_TOKEN } from '../config';
import { errorResponse } from '../HttpError';
import { EventTriggerPayload } from '../types';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (MIXPANEL_PROJECT_TOKEN == '') {
      res.status(200).json({
        message: `MIXPANEL_PROJECT_TOKEN not set`,
      });
      return;
    }

    const mp = mixpanel.init(MIXPANEL_PROJECT_TOKEN);

    const payload: EventTriggerPayload<'interaction_events', 'INSERT'> =
      req.body;
    const { new: event } = payload.event.data;

    if (event.profile_id) {
      await track(
        mp,
        event.event_type,
        'profile_' + sha256(`${event.profile_id}`),
        {
          event_subtype: event.event_subtype,
          id: event.id,
          data: event.data,
          circle_id: event.circle_id,
          profile_id: event.profile_id,
          org_id: event.org_id,
        }
      );
    }

    if (event.circle_id) {
      await track(
        mp,
        `circle_${event.event_type}`,
        `circle_${event.circle_id}`,
        {
          event_subtype: event.event_subtype,
          id: event.id,
          data: event.data,
          circle_id: event.circle_id,
          user_id: event.user_id ? sha256(`${event.user_id}`) : undefined,
          profile_id: event.profile_id
            ? sha256(`${event.profile_id}`)
            : undefined,
          org_id: event.org_id,
        }
      );
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

const track = (
  mp: Mixpanel,
  eventName: string,
  distinctId: string,
  props: Record<string, unknown>
): Promise<void> => {
  return new Promise<void>(resolve => {
    mp.track(
      eventName,
      {
        distinct_id: distinctId,
        ...props,
      },
      () => {
        resolve();
      }
    );
  });
};
