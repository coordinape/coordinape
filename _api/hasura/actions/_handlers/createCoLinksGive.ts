import assert from 'assert';

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';

import { adminClient } from '../../../../api-lib/gql/adminClient';
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

    if (points < POINTS_PER_GIVE) {
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
              profile_id: profileId,
              target_profile_id: activity.actor_profile_id,
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
    return res.status(200).json({ id: insert_colinks_gives_one.id });
  } catch (e: any) {
    return errorResponse(res, e);
  }
}