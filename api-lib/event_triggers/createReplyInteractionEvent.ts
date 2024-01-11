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
          new: { id: reply_id, activity_id, profile_id },
        },
      },
    }: EventTriggerPayload<'replies', 'INSERT'> = req.body;

    const { activities_by_pk } = await adminClient.query(
      {
        activities_by_pk: [
          { id: activity_id },
          { private_stream: true, big_question_id: true },
        ],
      },
      { operationName: 'addReplayInteractionEvent_getActivityInfo' }
    );

    if (activities_by_pk?.private_stream || activities_by_pk?.big_question_id) {
      await insertInteractionEvents({
        event_type: 'reply_create',
        profile_id: profile_id,
        data: {
          reply_id,
          activity_id,
          hostname: req.headers?.host || '',
          private_stream: activities_by_pk.private_stream,
          big_question_id: activities_by_pk.big_question_id,
        },
      });
      return res.status(200).json({
        message: 'add reply interaction event recorded',
      });
    }
    return res.status(200);
  } catch (e) {
    return errorResponse(res, e);
  }
}
