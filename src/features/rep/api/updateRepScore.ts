import assert from 'assert';

import {
  reputation_scores_constraint,
  reputation_scores_update_column,
} from '../../../../api-lib/gql/__generated__/zeus/index';
import { adminClient } from '../../../../api-lib/gql/adminClient';

import { getRepScore } from './getRepScore';

export const updateRepScoreForAddress = async (address: string) => {
  const { profiles } = await adminClient.query(
    {
      profiles: [
        {
          where: {
            address: { _ilike: address },
          },
        },
        {
          id: true,
          reputation_score: {},
        },
      ],
    },
    {
      operationName: 'updateRepScoreForAddress__getProfileIds',
    }
  );

  const profile = profiles.pop();
  if (profile) {
    await updateRepScore(profile.id);
    // TODO: if the score is >0 put it on chain? one_time? if reputation_score is nil or?
    // TODO: when do we do this in the future? Can we batch this?
    // TODO: just do this now once in the backfill, then ???
    // TODO: how many can we batch at once?
  } else {
    throw new Error('no profile found for address: ' + address);
  }
};

export const updateRepScore = async (profileId: number) => {
  const {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    changed: _changed,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    previousTotal: _prevTotal,
    ...scores
  } = await getRepScore(profileId);

  const { insert_reputation_scores_one } = await adminClient.mutate(
    {
      insert_reputation_scores_one: [
        {
          object: {
            profile_id: profileId,
            ...scores,
          },
          on_conflict: {
            constraint: reputation_scores_constraint.reputation_scores_pkey,
            update_columns: [
              reputation_scores_update_column.pgive_score,
              reputation_scores_update_column.twitter_score,
              reputation_scores_update_column.email_score,
              reputation_scores_update_column.links_score,
              reputation_scores_update_column.poap_score,
              reputation_scores_update_column.github_score,
              reputation_scores_update_column.invite_score,
              reputation_scores_update_column.linkedin_score,
              reputation_scores_update_column.colinks_engagement_score,
              reputation_scores_update_column.total_score,
              reputation_scores_update_column.farcaster_score,
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
  return scores;
};
