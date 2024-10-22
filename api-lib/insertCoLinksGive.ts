import assert from 'assert';

import { fetchPoints } from '../_api/hasura/actions/_handlers/createCoLinksGive.ts';
import { POINTS_PER_GIVE } from '../src/features/points/getAvailablePoints.ts';

import {
  skills_constraint,
  skills_update_column,
} from './gql/__generated__/zeus';
import { adminClient } from './gql/adminClient.ts';
import { UnprocessableError } from './HttpError.ts';

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
export const insertCoLinksGive = async (
  giver_profile: any,
  receiver_profile: any,
  hash: string,
  skill?: string
) => {
  const { newPoints, giveId } = await checkPointsAndCreateGive(
    giver_profile.id,
    receiver_profile.id,
    {
      cast_hash: hash,
      skill: skill,
    }
  );

  return { giveId, newPoints };
};
