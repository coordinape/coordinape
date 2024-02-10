import type { VercelRequest, VercelResponse } from '@vercel/node';

import { adminClient } from '../gql/adminClient';
import { errorResponse } from '../HttpError';
import { EventTriggerPayload } from '../types';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { event }: EventTriggerPayload<'colinks_gives', 'INSERT'> = req.body;
    if (event.data?.new) {
      return handleInsert(event.data.new, res);
    } else {
      console.error('Unexpected state invoked');
    }
  } catch (e) {
    return errorResponse(res, e);
  }
}

const handleInsert = async (
  newRow: EventTriggerPayload<
    'colinks_gives',
    'INSERT'
  >['event']['data']['new'],
  res: VercelResponse
) => {
  const { id, profile_id, target_profile_id, created_at } = newRow;

  await adminClient.mutate(
    {
      insert_notifications_one: [
        {
          object: {
            profile_id: target_profile_id,
            actor_profile_id: profile_id,
            colinks_give_id: id,
            created_at: created_at,
          },
        },
        {
          __typename: true,
        },
      ],
    },
    {
      operationName: 'insert_colinksGiveNotification',
    }
  );

  res.status(200).json({
    message: `colinks_give notification processed`,
  });
};
