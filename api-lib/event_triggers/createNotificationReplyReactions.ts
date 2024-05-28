import assert from 'assert';

import type { VercelRequest, VercelResponse } from '@vercel/node';

import { adminClient } from '../gql/adminClient';
import { errorResponse } from '../HttpError';
import { EventTriggerPayload } from '../types';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const {
      event,
    }: EventTriggerPayload<'replies_reactions', 'INSERT' | 'DELETE'> = req.body;

    if (event.data?.new) {
      return await handleInsert(event.data.new, res);
    } else if (event.data?.old) {
      return await handleDelete(event.data.old, res);
    }
  } catch (e) {
    return errorResponse(res, e);
  }
}

const handleInsert = async (
  newRow: EventTriggerPayload<
    'replies_reactions',
    'INSERT'
  >['event']['data']['new'],
  res: VercelResponse
) => {
  const { profile_id, created_at, id, reply_id } = newRow;
  const { replies_by_pk } = await adminClient.query(
    {
      replies_by_pk: [
        {
          id: reply_id,
        },
        {
          profile_id: true,
        },
      ],
    },
    {
      operationName: 'getReplyForReactionNotification',
    }
  );

  assert(replies_by_pk);

  if (replies_by_pk.profile_id === profile_id) {
    return res.status(200).json({
      message: `no notification for reactions you send yourself`,
    });
  }
  await adminClient.mutate(
    {
      insert_notifications_one: [
        {
          object: {
            profile_id: replies_by_pk.profile_id,
            actor_profile_id: profile_id,
            created_at: created_at,
            reply_reaction_id: id,
          },
        },
        {
          __typename: true,
        },
      ],
    },
    {
      operationName: 'insert_replyreactionNotification',
    }
  );

  res.status(200).json({
    message: `reply reaction notification recorded`,
  });
};

const handleDelete = async (
  newRow: EventTriggerPayload<
    'replies_reactions',
    'DELETE'
  >['event']['data']['old'],
  res: VercelResponse
) => {
  const { id } = newRow;
  await adminClient.mutate(
    {
      delete_notifications: [
        {
          where: {
            reaction_id: {
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
      operationName: 'delete_replyreactionNotification',
    }
  );

  res.status(200).json({
    message: `reply reaction notification deleted`,
  });
};
