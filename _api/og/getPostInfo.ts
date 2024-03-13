import assert from 'assert';

import { adminClient } from '../../api-lib/gql/adminClient.ts';

export const getPostInfo = async (id: string) => {
  const { activities_by_pk } = await adminClient.query(
    {
      activities_by_pk: [
        {
          id: Number(id),
        },
        {
          contribution: {
            description: true,
            profile: {
              id: true,
              avatar: true,
              name: true,
              links: true,
              reputation_score: {
                total_score: true,
              },
            },
          },
        },
      ],
    },
    {
      operationName: 'postInfoForOgTags',
    }
  );
  const post = activities_by_pk;
  assert(post, 'no post found');
  return post.contribution;
};
