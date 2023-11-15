import { adminClient } from '../../../../api-lib/gql/adminClient';

import { GITHUB_SCORE_BASE, GITHUB_SCORE_MAX } from './scoring';

export const getPostsScore = async (profileId: number) => {
  const data = await adminClient.query(
    {
      __alias: {
        totalPosts: {
          activities_aggregate: [
            {
              where: {
                contribution: {
                  _and: [
                    { private_stream: { _eq: true } },
                    { profile_id: { _eq: profileId } },
                  ],
                },
              },
            },
            { aggregate: { count: [{}, true] } },
          ],
        },
        postsWithReplies: {
          activities_aggregate: [
            {
              where: {
                _and: [
                  {
                    contribution: {
                      _and: [
                        { private_stream: { _eq: true } },
                        { profile_id: { _eq: profileId } },
                      ],
                    },
                  },
                  {
                    replies_aggregate: {
                      count: {
                        filter: {
                          profile_id: { _neq: profileId },
                        },
                        predicate: { _gt: 0 },
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
      operationName: 'getPostsScore',
    }
  );

  // eslint-disable-next-line no-console
  console.log({ posts: JSON.stringify(data) });
  // if (!contributions_aggregate) {
  //   return 0;
  // }

  return Math.floor(Math.min(GITHUB_SCORE_MAX, GITHUB_SCORE_BASE));
};
