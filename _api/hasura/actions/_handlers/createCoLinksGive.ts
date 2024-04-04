import assert from 'assert';

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';

import {
  skills_constraint,
  skills_update_column,
} from '../../../../api-lib/gql/__generated__/zeus';
import { adminClient } from '../../../../api-lib/gql/adminClient';
import { insertInteractionEvents } from '../../../../api-lib/gql/mutations';
import { getInput } from '../../../../api-lib/handlerHelpers';
import {
  errorResponse,
  UnprocessableError,
} from '../../../../api-lib/HttpError';
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

export const checkPointsAndCreateGive = async (
  profileId: number,
  target_profile_id: number,
  payload: { activity_id?: number; skill?: string; cast_hash?: string }
) => {
  const { canGive, points } = await fetchPoints(profileId);

  if (!canGive) {
    throw new UnprocessableError('not enough points');
  }
  // insert the thing
  // checkpoint balance
  // return the id

  const newPoints = points - POINTS_PER_GIVE;

  const { insert_colinks_gives_one } = await adminClient.mutate(
    {
      insert_colinks_gives_one: [
        {
          object: {
            activity_id: payload.activity_id,
            cast_hash: payload.cast_hash,
            profile_id: profileId,
            target_profile_id: target_profile_id,
            give_skill: payload.skill
              ? {
                  data: {
                    name: payload.skill,
                  },
                  on_conflict: {
                    constraint: skills_constraint.skills_pkey,
                    update_columns: [skills_update_column.name],
                  },
                }
              : undefined,
          },
        },
        {
          id: true,
        },
      ],
      update_profiles: [
        {
          where: { id: { _eq: profileId } },
          _set: {
            points_balance: newPoints,
            points_checkpointed_at: 'now()',
          },
        },
        {
          affected_rows: true,
        },
      ],
    },
    {
      operationName: 'createCoLinksGive__insertAndCheckpoint',
    }
  );
  assert(insert_colinks_gives_one);
  return { newPoints, giveId: insert_colinks_gives_one.id };
};

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

  return { points, canGive: points >= POINTS_PER_GIVE };
};
