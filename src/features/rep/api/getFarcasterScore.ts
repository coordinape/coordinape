import { adminClient } from '../../../../api-lib/gql/adminClient';

import {
  FARCASTER_FOLLOWER_VALUE,
  FARCASTER_FOLLOWING_VALUE,
  FARCASTER_SCORE_BASE,
  FARCASTER_SCORE_MAX,
} from './scoring';

export const getFarcasterScore = async (profileId: number) => {
  const { farcaster_accounts_by_pk } = await adminClient.query(
    {
      farcaster_accounts_by_pk: [
        {
          profile_id: profileId,
        },
        {
          fid: true,
        },
      ],
    },
    {
      operationName: 'score__getFarcasterScore',
    }
  );

  if (!farcaster_accounts_by_pk || !farcaster_accounts_by_pk.fid) {
    return 0;
  }

  // get their links and target_links
  const { following, followers } = await adminClient.query(
    {
      __alias: {
        following: {
          farcaster_links_aggregate: [
            {
              where: {
                fid: { _eq: farcaster_accounts_by_pk.fid },
              },
            },
            { aggregate: { count: [{}, true] } },
          ],
        },
        followers: {
          farcaster_links_aggregate: [
            {
              where: {
                target_fid: { _eq: farcaster_accounts_by_pk.fid },
              },
            },
            { aggregate: { count: [{}, true] } },
          ],
        },
      },
    },
    {
      operationName: 'score__getFarcasterScore__links',
    }
  );

  const followerCount = followers.aggregate?.count ?? 0;
  const followingCount = following.aggregate?.count ?? 0;

  const followerScore = followerCount * FARCASTER_FOLLOWER_VALUE;
  const followingScore = followingCount * FARCASTER_FOLLOWING_VALUE;

  return Math.floor(
    Math.min(
      FARCASTER_SCORE_MAX,
      FARCASTER_SCORE_BASE + followerScore + followingScore
    )
  );
};
