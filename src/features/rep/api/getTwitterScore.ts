import { adminClient } from '../../../../api-lib/gql/adminClient';

const TWITTER_SCORE_BASE = 100;
const FOLLOWER_SCORE_VALUE = 0.1;
const TWITTER_SCORE_MAX = 400;

export const getTwitterScore = async (profileId: number) => {
  const { twitter_account_by_pk } = await adminClient.query(
    {
      twitter_account_by_pk: [
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
  if (!twitter_account_by_pk) {
    return 0;
  }

  const followerScore =
    twitter_account_by_pk.followers_count ?? 0 * FOLLOWER_SCORE_VALUE;

  return Math.floor(
    Math.min(TWITTER_SCORE_MAX, TWITTER_SCORE_BASE + followerScore)
  );
};
