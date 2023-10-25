import assert from 'assert';

import {
  reputation_scores_constraint,
  reputation_scores_update_column,
} from '../../../../api-lib/gql/__generated__/zeus';
import { adminClient } from '../../../../api-lib/gql/adminClient';

import { getRepScore } from './getRepScore';

export const updateRepScore = async (profileId: number) => {
  const score = await getRepScore(profileId);
  const { pgive, twitter, email, keys, total } = score;

  const { insert_reputation_scores_one } = await adminClient.mutate(
    {
      insert_reputation_scores_one: [
        {
          object: {
            profile_id: profileId,
            pgive_score: pgive,
            twitter_score: twitter,
            email_score: email,
            keys_score: keys,
            total_score: total,
          },
          on_conflict: {
            constraint: reputation_scores_constraint.reputation_scores_pkey,
            update_columns: [
              reputation_scores_update_column.pgive_score,
              reputation_scores_update_column.twitter_score,
              reputation_scores_update_column.email_score,
              reputation_scores_update_column.keys_score,
              reputation_scores_update_column.total_score,
            ],
          },
        },
        {
          __typename: true,
        },
      ],
    },
    {
      operationName: 'updateRepScore',
    }
  );
  assert(insert_reputation_scores_one);
  return score;
};
