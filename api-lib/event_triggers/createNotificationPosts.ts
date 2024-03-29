import type { VercelRequest, VercelResponse } from '@vercel/node';

import { adminClient } from '../gql/adminClient';
import { errorResponse } from '../HttpError';
import { EventTriggerPayload } from '../types';

import {
  lookupMentionedNames,
  parseMentions,
} from './createNotificationReplies';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const {
      event,
    }: EventTriggerPayload<'contributions', 'INSERT' | 'DELETE' | 'UPDATE'> =
      req.body;
    if (!event.data?.new && event.data?.old) {
      return handleDelete(event.data.old, res);
    } else if (event.data?.new?.deleted_at) {
      return handleDelete(event.data.new, res);
    } else if (event.data?.old && event.data?.new) {
      return handleUpdate(event.data.old, event.data.new, res);
    } else if (event.data?.new) {
      return handleInsert(event.data.new, res);
    }
  } catch (e) {
    return errorResponse(res, e);
  }
}

const handleUpdate = async (
  oldRow: EventTriggerPayload<
    'contributions',
    'UPDATE'
  >['event']['data']['new'],
  newRow: EventTriggerPayload<
    'contributions',
    'UPDATE'
  >['event']['data']['new'],
  res: VercelResponse
) => {
  const { profile_id, created_at, id } = newRow;

  // get all the old ones
  // post was created: notify all mentioned users
  const oldMentions = parseMentions(oldRow.description);
  const oldMentionedProfileIds = await lookupMentionedNames(oldMentions);

  const newMentions = parseMentions(newRow.description);
  const newMentionedProfileIds = await lookupMentionedNames(newMentions);

  const mentionsToDelete: number[] = oldMentionedProfileIds.filter(
    id => !newMentionedProfileIds.includes(id)
  );

  // Find elements in new array that were not in old array
  const mentionsToAdd: number[] = newMentionedProfileIds.filter(
    id => !oldMentionedProfileIds.includes(id)
  );

  const allDelete = mentionsToDelete.map(async mentionedProfileId => {
    await adminClient.mutate(
      {
        delete_notifications: [
          {
            where: {
              profile_id: {
                _eq: mentionedProfileId,
              },
              mention_post_id: {
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
        operationName: 'delete_postNotification',
      }
    );
  });

  const allAdd = mentionsToAdd.map(async mentionedProfileId => {
    await createMentionedInPostNotification({
      profile_id,
      created_at,
      id,
      mentionedProfileId,
    });
  });
  await Promise.all([...allDelete, ...allAdd]);

  res.status(200).json({
    message: `post notification processed`,
  });
};

const handleInsert = async (
  newRow: EventTriggerPayload<
    'contributions',
    'INSERT'
  >['event']['data']['new'],
  res: VercelResponse
) => {
  const { profile_id, created_at, id } = newRow;

  // post was created: notify all mentioned users
  const mentions = parseMentions(newRow.description);
  const mentionedProfileIds = await lookupMentionedNames(mentions);

  const all = mentionedProfileIds.map(async mentionedProfileId => {
    await createMentionedInPostNotification({
      profile_id,
      created_at,
      id,
      mentionedProfileId,
    });
  });
  await Promise.all(all);

  res.status(200).json({
    message: `post notification processed`,
  });
};

const handleDelete = async (
  newRow: EventTriggerPayload<
    'contributions',
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
            mention_post_id: {
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
      operationName: 'delete_postNotification',
    }
  );

  res.status(200).json({
    message: `post notification deleted`,
  });
};

const createMentionedInPostNotification = async ({
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
  // you cannot mention yourself
  if (mentionedProfileId === profile_id) {
    return;
  }

  // we can see each other
  const { private_stream_visibility_by_pk } = await adminClient.query(
    {
      private_stream_visibility_by_pk: [
        {
          profile_id: mentionedProfileId,
          view_profile_id: profile_id,
        },
        {
          __typename: true,
        },
      ],
    },
    {
      operationName: 'getPrivateStreamVisibility',
    }
  );

  const okToMention = !!private_stream_visibility_by_pk;

  if (!okToMention) {
    // eslint-disable-next-line no-console
    console.log('skipped post mention creation', {
      mentionedProfileId,
      profile_id,
    });
    return;
  }

  return await adminClient.mutate(
    {
      insert_notifications_one: [
        {
          object: {
            profile_id: mentionedProfileId,
            actor_profile_id: profile_id,
            mention_post_id: id,
            created_at: created_at,
          },
        },
        {
          __typename: true,
        },
      ],
    },
    {
      operationName: 'insert_mentionedInPostNotification',
    }
  );
};
