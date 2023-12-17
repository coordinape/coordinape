/* eslint-disable no-console */
import { ComponentProps, useEffect } from 'react';

import { useQuery } from 'react-query';

import { order_by } from '../../lib/gql/__generated__/zeus';
import { client } from '../../lib/gql/client';
import { CoLinksMember } from '../../pages/colinks/explore/CoLinksMember';
import { LoadingIndicator } from 'components/LoadingIndicator';
import { Flex, Panel, Text } from 'ui';

import { QUERY_KEY_COLINKS } from './wizard/CoLinksWizard';

export const PostResultsBoard = ({
  limit = 100,
  query,
}: {
  query?: string;
  limit?: number;
  size?: ComponentProps<typeof CoLinksMember>['size'];
}) => {
  useEffect(() => {
    console.log({ data });
  });

  const { data } = useQuery(
    [QUERY_KEY_COLINKS, 'search_post_results', 'holders'],
    async () => {
      const { matching } = await client.query(
        {
          __alias: {
            matching: {
              search_contributions: [
                {
                  args: {
                    search: query,
                    result_limit: 100,
                  },
                  order_by: [{ created_at: order_by.desc }],
                  limit: limit,
                },
                {
                  id: true,
                  description: true,
                  created_at: true,
                  updated_at: true,
                },
              ],
            },
          },
        },
        {
          operationName: 'search_posts_PostResultsBoard',
        }
      );
      return matching;
    }
  );
  // return <Leaderboard leaders={leaders} size={size} hideRank={hideRank} />;

  if (data === undefined) return <LoadingIndicator />;
  return (
    <Flex column css={{ gap: '$md', width: '100%' }}>
      {data.map((post, idx) => {
        return (
          <Panel key={idx}>
            <Text>Post Body:</Text>
            <Text>{post.description}</Text>
          </Panel>
        );
      })}
    </Flex>
  );
};
