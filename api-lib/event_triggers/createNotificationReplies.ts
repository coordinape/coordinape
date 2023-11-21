import type { VercelRequest, VercelResponse } from '@vercel/node';

import { adminClient } from '../gql/adminClient';
import { errorResponse } from '../HttpError';
import { EventTriggerPayload } from '../types';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const {
      event: {
        data: {
          new: { profile_id, created_at, id, activity_actor_id },
        },
      },
    }: EventTriggerPayload<'replies', 'INSERT'> = req.body;

    await adminClient.mutate(
      {
        insert_notifications_one: [
          {
            object: {
              profile_id: activity_actor_id,
              actor_profile_id: profile_id,
              reply_id: id,
              created_at: created_at,
            },
          },
          {
            __typename: true,
          },
        ],
      },
      {
        operationName: 'insert_repliesNotification',
      }
    );

    res.status(200).json({
      message: `replies notification recorded`,
    });
  } catch (e) {
    return errorResponse(res, e);
  }
}
