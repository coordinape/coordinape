import assert from 'assert';

import type { VercelRequest, VercelResponse } from '@vercel/node';

import { adminClient } from '../gql/adminClient';
import * as mutations from '../gql/mutations';
import { errorResponse } from '../HttpError';
import { EventTriggerPayload } from '../types';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const {
      event: {
        data: {
          new: { id: reaction_id, created_at, profile_id, reaction },
        },
      },
    }: EventTriggerPayload<'reactions', 'INSERT'> = req.body;

    const data = await getCircleandOrg(reaction_id);
    await mutations.insertInteractionEvents({
      event_type: 'reaction_create',
      circle_id: data.reactions_by_pk?.activity?.circle_id,
      profile_id: profile_id,
      data: {
        created_at: created_at,
        reaction_id: reaction_id,
        reaction: reaction,
      },
    });

    res.status(200).json({
      message: `reaction interaction event recorded`,
    });
  } catch (e) {
    return errorResponse(res, e);
  }
}

async function getCircleandOrg(reaction_id: number) {
  const data = await adminClient.query(
    {
      reactions_by_pk: [
        { id: reaction_id },
        {
          activity: {
            circle_id: true,
          },
        },
      ],
    },
    {
      operationName: 'createReactionInteractionEvent__getCircleandOrg',
    }
  );

  assert(data.reactions_by_pk?.activity);
  return data;
}
