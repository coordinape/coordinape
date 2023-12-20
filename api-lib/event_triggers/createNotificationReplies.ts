/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
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

  // reply was created: notify all visible users who are mentioned in the reply
  // notify the creator of the post that they have a new reply, but don't duplicate mention them

  const mentions = parseMentions(newRow.reply);
  const mentionedProfileIds = await lookupMentionedNames(mentions);
  mentionedProfileIds.map(async mentionedProfileId => {
    await createMentionedInReplyNotification({
      profile_id,
      created_at,
      id,
      mentionedProfileId,
    });
  });

  // parse mentions from text
  // get profiles for users in private_stream_visibility of reply OR in priovate stream visibilty of the main post (so they can bot hsee the thread)
  //  if so, create a notification for mentioned user

  if (activity_actor_id === profile_id) {
    return res.status(200).json({
      message: `no notification for replies you send yourself`,
    });
  }
  await createReplyNotification({
    activity_actor_id,
    profile_id,
    created_at,
    id,
  });
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

const parseMentions = (text: string) => {
  const regex = /@\S+/g;
  const mentions = text.match(regex);

  if (!mentions) {
    return [];
  }

  console.log('parseMentions', { mentions });

  return mentions.map(mention => mention.substring(1));
};

const lookupMentionedNames = async (mentions: string[]): Promise<number[]> => {
  const { profiles } = await adminClient.query(
    {
      profiles: [
        {
          where: {
            name: {
              _in: mentions,
            },
          },
        },
        {
          id: true,
        },
      ],
    },
    {
      operationName: 'getMentionedNames',
    }
  );

  // TODO: lookup private_stream_visibility
  console.log('lookupMentionedNames', { profiles });
  return profiles.map(profile => profile.id);
};

const createReplyNotification = async ({
  activity_actor_id,
  profile_id,
  id,
  created_at,
}: {
  activity_actor_id: number;
  profile_id: number;
  id: number;
  created_at: number;
}) => {
  return await adminClient.mutate(
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
};

const createMentionedInReplyNotification = async ({
  profile_id,
  id,
  created_at,
  mentionedProfileId,
}: {
  profile_id: number;
  id: number;
  created_at: number;
  mentionedProfileId: number;
}) => {
  return await adminClient.mutate(
    {
      insert_notifications_one: [
        {
          object: {
            profile_id: mentionedProfileId,
            actor_profile_id: profile_id,
            mentioned_reply_id: id,
            created_at: created_at,
          },
        },
        {
          __typename: true,
        },
      ],
    },
    {
      operationName: 'insert_mentionedInReplyNotification',
    }
  );
};
