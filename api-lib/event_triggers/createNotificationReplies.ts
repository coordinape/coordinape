import type { VercelRequest, VercelResponse } from '@vercel/node';

import { adminClient } from '../gql/adminClient';
import { errorResponse } from '../HttpError';
import { EventTriggerPayload } from '../types';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const {
      event,
    }: EventTriggerPayload<'replies', 'INSERT' | 'DELETE' | 'UPDATE'> =
      req.body;
    if (!event.data?.new && event.data?.old) {
      return handleDelete(event.data.old, res);
    } else if (event.data?.old?.deleted_at) {
      return handleDelete(event.data.old, res);
    } else if (event.data?.new) {
      return handleInsert(event.data.new, res);
    }
  } catch (e) {
    return errorResponse(res, e);
  }
}

const handleInsert = async (
  newRow: EventTriggerPayload<'replies', 'INSERT'>['event']['data']['new'],
  res: VercelResponse
) => {
  const { activity_actor_id, profile_id, created_at, id } = newRow;

  if (activity_actor_id === profile_id) {
    return res.status(200).json({
      message: `no notification for replies you send the self`,
    });
  }
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
};

const handleDelete = async (
  newRow: EventTriggerPayload<'replies', 'DELETE'>['event']['data']['old'],
  res: VercelResponse
) => {
  const { id } = newRow;
  await adminClient.mutate(
    {
      delete_notifications: [
        {
          where: {
            reply_id: {
              _eq: id,
            },
          },
        },
        {
          __typename: true,
        },
      ],
    },
    {
      operationName: 'delete_repliesNotification',
    }
  );

  res.status(200).json({
    message: `replies notification deleted`,
  });
};
