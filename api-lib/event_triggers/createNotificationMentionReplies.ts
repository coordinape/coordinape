import type { VercelRequest, VercelResponse } from '@vercel/node';

import { adminClient } from '../gql/adminClient';
import { errorResponse } from '../HttpError';
import { EventTriggerPayload } from '../types';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { event }: EventTriggerPayload<'replies', 'INSERT' | 'UPDATE'> =
      req.body;
    if (event.data?.old && event.data?.new) {
      // return handleUpdate
      return res.status(200).json({ updated: true });
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
  const { activity_actor_id, profile_id, created_at, id, reply } = newRow;

  const mentions = parseMentions(reply);

  mentions.map(mention_profile_name =>
    createMentionNotification({
      activity_actor_id,
      mention_profile_name,
      created_at,
      profile_id,
      id,
      res,
    })
  );

  res.status(200).json({
    message: `replies mention notification recorded`,
  });
};

const parseMentions = (text: string) => {
  const regex = /@\S+/g;
  const mentions = text.match(regex);

  if (!mentions) {
    return [];
  }

  // eslint-disable-next-line no-console
  console.log({ mentions });

  return mentions.map(mention => mention.substring(1));
};

const createMentionNotification = async ({
  activity_actor_id,
  mention_profile_name,
  created_at,
  profile_id,
  id,
  res,
}: {
  activity_actor_id: number;
  mention_profile_name: string;
  created_at: string;
  profile_id: number;
  id: number;
  res: VercelResponse;
}) => {
  // find profile_id of mention_profile_name
  const { profiles } = await adminClient.query(
    {
      profiles: [
        {
          where: {
            name: {
              _eq: mention_profile_name,
            },
          },
          limit: 1,
        },
        {
          id: true,
        },
      ],
    },
    {
      operationName:
        'find_mention_profile_id__createMentionNotificationReplies',
    }
  );
  if (profiles.length === 0) {
    console.error(`no profile found for @${mention_profile_name}`);
    return;
  }

  const mentioned_profile_id = profiles[0].id;

  if (mentioned_profile_id === profile_id) {
    return res.status(200).json({
      message: `no notification for self mentions`,
    });
  }

  await adminClient.mutate(
    {
      insert_notifications_one: [
        {
          object: {
            profile_id: mentioned_profile_id,
            actor_profile_id: activity_actor_id,
            reply_id: id,
            created_at: created_at,
            mention: true,
          },
        },
        {
          __typename: true,
        },
      ],
    },
    {
      operationName:
        'insert_mentionsNotification__createMentionNotificationReplies',
    }
  );
};
