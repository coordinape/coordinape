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

const deleteCoLinksGiveInput = z
  .object({
    give_id: z.number(),
  })
  .strict();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const {
      payload,
      session: { hasuraProfileId: profileId },
    } = await getInput(req, deleteCoLinksGiveInput);

    // lookup give by pk
    const { colinks_gives_by_pk } = await adminClient.query(
      {
        colinks_gives_by_pk: [
          {
            id: payload.give_id,
          },
          { profile_id: true },
        ],
      },
      { operationName: 'deleteCoLinksGive__fetchGive' }
    );

    if (!colinks_gives_by_pk) {
      throw new UnprocessableError('give not found');
    }
    if (colinks_gives_by_pk.profile_id !== profileId) {
      throw new UnprocessableError('cannot delete someone elses give');
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
    // delete the thing
    // checkpoint balance
    // return the id

    const newPoints = points + POINTS_PER_GIVE;
    await adminClient.mutate(
      {
        delete_colinks_gives: [
          {
            where: {
              id: { _eq: payload.give_id },
            },
          },
          {
            affected_rows: true,
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
        operationName: 'deleteCoLinksGive__deleteAndCheckpoint',
      }
    );
    return res.status(200).json({ success: true });
  } catch (e: any) {
    return errorResponse(res, e);
  }
}
