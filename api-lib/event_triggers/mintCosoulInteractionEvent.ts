import { assert } from 'console';

import type { VercelRequest, VercelResponse } from '@vercel/node';

import { adminClient } from '../gql/adminClient';
import { insertInteractionEvents } from '../gql/mutations';
import { errorResponse } from '../HttpError';
import { EventTriggerPayload } from '../types';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const {
      event: {
        data: {
          new: { address },
        },
      },
    }: EventTriggerPayload<'cosouls', 'INSERT'> = req.body;

    const { profiles } = await adminClient.query(
      {
        profiles: [
          { where: { address: { _ilike: address } }, limit: 1 },
          { id: true, invited_by: true },
        ],
      },
      { operationName: 'addReplayInteractionEvent_getActivityInfo' }
    );
    const profile = profiles.pop();
    assert(profile, 'failed to get profile id');

    if (profile?.invited_by) {
      await insertInteractionEvents({
        event_type: 'invitee_minted_cosoul',
        profile_id: profile?.id,
        data: {
          colinks: true,
          invited_by: profile.invited_by,
          hostname: req.headers.host,
        },
      });
      return res.status(200).json({
        message: 'minting cosoul interaction event recorded',
      });
    }
    return res.status(200);
  } catch (e) {
    return errorResponse(res, e);
  }
}
