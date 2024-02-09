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
} from '../../../../src/features/points/getAvailablePoints.ts';

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
    const { activities_by_pk } = await adminClient.query(
      {
        activities_by_pk: [
          { id: payload.activity_id },
          { id: true, actor_profile_id: true, deleted_at: true },
        ],
      },
      { operationName: 'createCoLinksGive__fetchActivity' }
    );

    if (!activities_by_pk) {
      throw new UnprocessableError('activity not found');
    }
    if (activities_by_pk.deleted_at) {
      throw new UnprocessableError('activity has been deleted');
    }
    if (activities_by_pk.actor_profile_id === profileId) {
      throw new UnprocessableError('cannot give to self');
    }

    const points = await getAvailablePoints();

    if (points < POINTS_PER_GIVE) {
      throw new UnprocessableError('not enough points');
    }
    // insert the thing
    // checkpoint balance
    // return the id
    const { insert_colinks_gives_one } = await adminClient.mutate(
      {
        insert_colinks_gives_one: [
          {
            object: {
              activity_id: payload.activity_id,
              profile_id: profileId,
              target_profile_id: activities_by_pk.actor_profile_id,
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
              points_balance: points - POINTS_PER_GIVE,
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
