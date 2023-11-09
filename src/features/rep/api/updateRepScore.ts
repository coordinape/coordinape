import assert from 'assert';

import {
  reputation_scores_constraint,
  reputation_scores_update_column,
} from '../../../../api-lib/gql/__generated__/zeus';
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
  } else {
    throw new Error('no profile found for address: ' + address);
  }
};

export const updateRepScore = async (profileId: number) => {
  const score = await getRepScore(profileId);
  const {
    pgive,
    twitter,
    email,
    links,
    poap,
    gitHub,
    invites,
    linkedIn,
    total,
  } = score;

  const { insert_reputation_scores_one } = await adminClient.mutate(
    {
      insert_reputation_scores_one: [
        {
          object: {
            profile_id: profileId,
            pgive_score: pgive,
            twitter_score: twitter,
            email_score: email,
            links_score: links,
            poap_score: poap,
            github_score: gitHub,
            total_score: total,
            invite_score: invites,
            linkedin_score: linkedIn,
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
