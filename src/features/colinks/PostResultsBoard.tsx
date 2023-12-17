/* eslint-disable no-console */
import assert from 'assert';
import { ComponentProps } from 'react';

import { abbreviateString } from 'abbreviateString';
import { DateTime } from 'luxon';
import { useQuery } from 'react-query';
import { NavLink } from 'react-router-dom';

import { order_by } from '../../lib/gql/__generated__/zeus';
import { client } from '../../lib/gql/client';
import {
  CoLinksMember,
  coLinksMemberSelector,
} from '../../pages/colinks/explore/CoLinksMember';
import { LoadingIndicator } from 'components/LoadingIndicator';
import useConnectedAddress from 'hooks/useConnectedAddress';
import useProfileId from 'hooks/useProfileId';
import { coLinksPaths } from 'routes/paths';
import { Flex, HR, Text } from 'ui';

import { QUERY_KEY_COLINKS } from './wizard/CoLinksWizard';

const CHARS_BEFORE_MATCH = 20;

export const PostResultsBoard = ({
  limit = 100,
  query,
}: {
  query?: string;
  limit?: number;
  size?: ComponentProps<typeof CoLinksMember>['size'];
}) => {
  const currentUserAddress = useConnectedAddress();
  const currentUserProfileId = useProfileId(true);

  const { data } = useQuery(
    [QUERY_KEY_COLINKS, 'search_post_results', 'holders'],
    async () => {
      assert(currentUserAddress, 'currentUserAddress is undefined');

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
                  where: {
                    profile_public: {
                      id: { _neq: currentUserProfileId },
                    },
                  },
                  order_by: [{ created_at: order_by.desc }],
                  limit: limit,
                },
                {
                  id: true,
                  description: true,
                  created_at: true,
                  updated_at: true,
                  profile_public: coLinksMemberSelector(currentUserAddress),
                  activity: {
                    id: true,
                  },
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
    },
    {
      enabled: !!currentUserAddress,
    }
  );
  // return <Leaderboard leaders={leaders} size={size} hideRank={hideRank} />;

  if (data === undefined) return <LoadingIndicator />;
  return (
    <Flex column css={{ gap: '$md', width: '100%' }}>
      {data.map((post, idx) => {
        return (
          <Flex
            column
            key={idx}
            css={{
              alignItems: 'flex-start',
              gap: '$sm',
            }}
          >
            <Flex row>
              {post.profile_public && (
                <CoLinksMember profile={post.profile_public} size={'long'} />
              )}
              <Flex
                as={NavLink}
                to={coLinksPaths.post(`${post.activity?.id}`)}
                css={{
                  color: '$text',
                  textDecoration: 'none',
                }}
              >
                <Text size="xs" color="neutral" css={{ pl: '$lg' }}>
                  {DateTime.fromISO(post.created_at).toLocal().toRelative()}
                </Text>
              </Flex>
            </Flex>
            <Flex
              as={NavLink}
              to={coLinksPaths.post(`${post?.activity?.id}`)}
              css={{
                alignItems: 'flex-end',
                color: '$text',
                textDecoration: 'none',
              }}
            >
              {query && (
                <Text
                  css={{
                    fontFamily:
                      "Consolas, 'Liberation Mono', Menlo, Courier, monospace !important",
                  }}
                >
                  <SearchTermHighlights
                    description={shortenPost(post.description, query)}
                    query={query}
                  />
                </Text>
              )}
            </Flex>
            <HR />
          </Flex>
        );
      })}
    </Flex>
  );
};

const SearchTermHighlights = ({
  description,
  query,
}: {
  description: string;
  query: string;
}) => {
  const parts = description.split(new RegExp(`(${query})`, 'gi'));
  return (
    <Text
      inline
      css={{
        '*.queryMatch': {
          color: '$cta',
          textDecoration: 'underline',
          textDecorationThickness: '.1px',
        },
      }}
    >
      {parts.map((part, index) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <Text inline key={index} className="queryMatch">
            {part}
          </Text>
        ) : (
          <Text inline key={index}>
            {part}
          </Text>
        )
      )}
    </Text>
  );
};

const shortenPost = (description: string, word: string) => {
  if (!description.indexOf(word)) return description;

  const firstOccurance = Math.max(
    description.toLowerCase().indexOf(word.toLowerCase()) - CHARS_BEFORE_MATCH,
    0
  );
  const shortString = abbreviateString(description.slice(firstOccurance), 200);

  return firstOccurance > 3 ? '...' + shortString : shortString;
};
