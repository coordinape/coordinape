import assert from 'assert';
import * as crypto from 'crypto';

import type { VercelRequest, VercelResponse } from '@vercel/node';
import mixpanel, { Mixpanel } from 'mixpanel';

import { MIXPANEL_PROJECT_TOKEN } from '../config';
import { adminClient } from '../gql/adminClient';
import { errorResponse } from '../HttpError';
import { EventTriggerPayload } from '../types';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (MIXPANEL_PROJECT_TOKEN == '') {
      throw new Error(`MIXPANEL_PROJECT_TOKEN not set`);
    }

    const mp = mixpanel.init(MIXPANEL_PROJECT_TOKEN);

    const payload: EventTriggerPayload<'interaction_events', 'INSERT'> =
      req.body;
    const { new: event } = payload.event.data;

    const eventData: Record<string, any> = {
      ...(event.data ?? {}),
      event_subtype: event.event_subtype,
      id: event.id,
      circle_id: event.circle_id,
      org_id: event.org_id,
    };

    if (event.circle_id) {
      const { circles_by_pk: circle } = await adminClient.query(
        {
          circles_by_pk: [
            { id: event.circle_id },
            {
              name: true,
              organization_id: true,
              organization: { sample: true, name: true },
            },
          ],
        },
        { operationName: 'mixpanel_getOrgId' }
      );
      assert(circle);
      eventData.org_id = circle.organization_id;
      eventData.circle_name = circle.name;
      eventData.organization_name = circle.organization.name;
      eventData.sample = circle.organization.sample;
    } else if (event.org_id) {
      const { organizations_by_pk: org } = await adminClient.query(
        {
          organizations_by_pk: [
            { id: event.org_id },
            { sample: true, name: true },
          ],
        },
        { operationName: 'mixpanel_getOrgName' }
      );
      assert(org);
      eventData.organization_name = org.name;
      eventData.sample = org.sample;
    }

    if (event.profile_id) {
      await track(
        mp,
        event.event_type,
        'profile_' + sha256(`${event.profile_id}`),
        {
          profile_id: event.profile_id,
          ...eventData,
        }
      );
    }

    if (event.circle_id) {
      await track(
        mp,
        `circle_${event.event_type}`,
        `circle_${event.circle_id}`,
        {
          profile_id: event.profile_id
            ? sha256(`${event.profile_id}`)
            : undefined,
          ...eventData,
        }
      );
    }

    res.status(200).json({ message: `user event recorded` });
  } catch (e) {
    return errorResponse(res, e);
  }
}

const sha256 = (input: string) =>
  crypto.createHash('sha256').update(input).digest('base64');

const track = (
  mp: Mixpanel,
  eventName: string,
  distinct_id: string,
  props: Record<string, unknown>
) =>
  new Promise<void>(resolve =>
    mp.track(eventName, { distinct_id, ...props }, () => resolve())
  );
