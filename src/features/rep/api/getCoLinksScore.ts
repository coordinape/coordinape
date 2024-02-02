import { adminClient } from '../../../../api-lib/gql/adminClient';

import {
  COLINK_LINK_HOLDER_VALUE,
  COLINK_LINK_HOLDING_VALUE,
  COLINKS_ENGAGEMENT_POST_SCORE,
  COLINKS_ENGAGEMENT_POST_WITH_ANY_REACTIONS_SCORE,
  COLINKS_ENGAGEMENT_POST_WITH_ANY_REPLIES_SCORE,
  COLINKS_ENGAGEMENT_SCORE_MAX,
  COLINKS_LINK_SCORE_MAX,
} from './scoring';

// Links score is our platform score for how many links you have and how much acitvity on your posts exists

export const getCoLinksScore = async (address: string, profileId: number) => {
  /*
  Maybe some other good things to indicate rep:
negative rep if people mute you (like if you have 10 mutes)
future stuff:
ENS validate
   */
  const {
    my_holders,
    my_holdings,
    totalPosts,
    postsWithReplies,
    postsWithReactions,
  } = await adminClient.query(
    {
      __alias: {
        my_holders: {
          link_holders_aggregate: [
            {
              where: {
                target: {
                  _eq: address,
                },
              },
            },
            {
              aggregate: {
                sum: {
                  amount: true,
                },
              },
            },
          ],
        },
        my_holdings: {
          link_holders_aggregate: [
            {
              where: {
                holder: {
                  _eq: address,
                },
              },
            },
            {
              aggregate: {
                sum: {
                  amount: true,
                },
              },
            },
          ],
        },
        totalPosts: {
          contributions_aggregate: [
            {
              where: {
                private_stream: { _eq: true },
                profile_id: { _eq: profileId },
              },
            },
            { aggregate: { count: [{}, true] } },
          ],
        },
        postsWithReplies: {
          contributions_aggregate: [
            {
              where: {
                _and: [
                  { private_stream: { _eq: true } },
                  { profile_id: { _eq: profileId } },
                  {
                    activity: {
                      reply_count: { _gt: 0 },
                    },
                  },
                ],
              },
            },
            { aggregate: { count: [{}, true] } },
          ],
        },
        postsWithReactions: {
          contributions_aggregate: [
            {
              where: {
                _and: [
                  { private_stream: { _eq: true } },
                  { profile_id: { _eq: profileId } },
                  {
                    activity: {
                      reaction_count: {
                        _gt: 0,
                      },
                    },
                  },
                ],
              },
            },
            { aggregate: { count: [{}, true] } },
          ],
        },
      },
    },
    {
      operationName: 'getLinkScore',
    }
  );

  const myHoldings = my_holdings.aggregate?.sum?.amount ?? 0;
  const myHolders = my_holders.aggregate?.sum?.amount ?? 0;

  const linkHolderScore = myHolders * COLINK_LINK_HOLDER_VALUE;
  const linkHoldingScore = myHoldings * COLINK_LINK_HOLDING_VALUE;
  const linksTotal = linkHolderScore + linkHoldingScore;

  const postScore =
    (totalPosts?.aggregate?.count || 0) * COLINKS_ENGAGEMENT_POST_SCORE;
  const replyScore =
    (postsWithReplies?.aggregate?.count || 0) *
    COLINKS_ENGAGEMENT_POST_WITH_ANY_REPLIES_SCORE;
  const reactionScore =
    (postsWithReactions?.aggregate?.count || 0) *
    COLINKS_ENGAGEMENT_POST_WITH_ANY_REACTIONS_SCORE;

  const postsTotal = Math.min(
    COLINKS_ENGAGEMENT_SCORE_MAX,
    postScore + replyScore + reactionScore
  );

  return {
    links_score: Math.floor(Math.min(COLINKS_LINK_SCORE_MAX, linksTotal)),
    colinks_engagement_score: Math.floor(
      Math.min(COLINKS_ENGAGEMENT_SCORE_MAX, postsTotal)
    ),
  };
};
