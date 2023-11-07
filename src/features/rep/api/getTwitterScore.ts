import { adminClient } from '../../../../api-lib/gql/adminClient';

import {
  TWITTER_FOLLOWER_SCORE_VALUE,
  TWITTER_SCORE_BASE,
  TWITTER_SCORE_MAX,
} from './scoring';

export const getTwitterScore = async (profileId: number) => {
  const { twitter_accounts_by_pk } = await adminClient.query(
    {
      twitter_accounts_by_pk: [
        {
          profile_id: profileId,
        },
        {
          followers_count: true,
          following_count: true,
        },
      ],
    },
    {
      operationName: 'getTwitterScore',
    }
  );
  if (!twitter_accounts_by_pk) {
    return 0;
  }

  const followerScore =
    twitter_accounts_by_pk.followers_count ?? 0 * TWITTER_FOLLOWER_SCORE_VALUE;

  return Math.floor(
    Math.min(TWITTER_SCORE_MAX, TWITTER_SCORE_BASE + followerScore)
  );
};
