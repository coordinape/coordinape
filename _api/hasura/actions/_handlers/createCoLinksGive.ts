import assert from 'assert';

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';

import { adminClient } from '../../../../api-lib/gql/adminClient';
import { insertInteractionEvents } from '../../../../api-lib/gql/mutations';
import { getInput } from '../../../../api-lib/handlerHelpers';
import {
  errorResponse,
  UnprocessableError,
} from '../../../../api-lib/HttpError';
import { checkPointsAndCreateGive } from '../../../../api-lib/insertCoLinksGive.ts';
import {
  getAvailablePoints,
  POINTS_PER_GIVE,
} from '../../../../src/features/points/getAvailablePoints';

const createCoLinksGiveInput = z
  .object({
    activity_id: z.number(),
    skill: z.string().optional(),
  })
  .strict();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const {
      payload,
      session: { hasuraProfileId: profileId },
    } = await getInput(req, createCoLinksGiveInput);

    // lookup activity by address
    // make sure its not deleted, and not us
    const { activities } = await adminClient.query(
      {
        activities: [
          {
            where: {
              id: { _eq: payload.activity_id },
              contribution: { deleted_at: { _is_null: true } },
            },
          },
          { id: true, actor_profile_id: true },
        ],
      },
      { operationName: 'createCoLinksGive__fetchActivity' }
    );

    const activity = activities.pop();

    if (!activity) {
      throw new UnprocessableError('post not found');
    }
    if (activity.actor_profile_id === profileId) {
      throw new UnprocessableError('cannot give to self');
    }

    const { newPoints, giveId } = await checkPointsAndCreateGive(
      profileId,
      activity.actor_profile_id,
      payload
    );

    const hostname = req.headers.host;
    await insertInteractionEvents({
      event_type: 'colinks_give_create',
      profile_id: profileId,
      data: {
        hostname,
        activity_id: payload.activity_id,
        skill: payload.skill,
        new_points_balance: newPoints,
      },
    });

    return res.status(200).json({ id: giveId });
  } catch (e: any) {
    return errorResponse(res, e);
  }
}

export const fetchPoints = async (profileId: number) => {
  const { profiles_by_pk } = await adminClient.query(
    {
      profiles_by_pk: [
        { id: profileId },
        {
          points_balance: true,
          points_checkpointed_at: true,
        },
      ],
    },
    {
      operationName: 'getPointsForGiver',
    }
  );
  assert(profiles_by_pk, 'current user profile not found');

  const points = getAvailablePoints(
    profiles_by_pk.points_balance,
    profiles_by_pk.points_checkpointed_at
  );

  const give = points ? Math.floor(points / POINTS_PER_GIVE) : 0;

  return { points, give, canGive: points >= POINTS_PER_GIVE };
};
