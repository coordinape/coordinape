import assert from 'assert';

import {
  SearchTermHighlights,
  shortenPost,
} from 'features/colinks/PostResults';
import { client } from 'lib/gql/client';
import { DateTime } from 'luxon';
import { useQuery } from 'react-query';
import { NavLink } from 'react-router-dom';

import { LoadingIndicator } from '../../../components/LoadingIndicator';
import {
  CoLinksMember,
  coLinksMemberSelector,
} from '../../../pages/colinks/explore/CoLinksMember';
import useConnectedAddress from 'hooks/useConnectedAddress';
import { coLinksPaths } from 'routes/paths';
import { Flex, HR, Text } from 'ui';

const LIMIT = 50;

export const ReplyResults = ({ query }: { query?: string }) => {
  const currentUserAddress = useConnectedAddress();
  const { data, isLoading } = useQuery(
    ['search', 'replies', query],
    async () => {
      assert(query);
      assert(currentUserAddress);

      const { matching } = await client.query(
        {
          __alias: {
            matching: {
              search_replies: [
                {
                  args: {
                    search: query,
                  },
                  limit: LIMIT,
                },
                {
                  id: true,
                  reply: true,
                  profile_public: coLinksMemberSelector(currentUserAddress),
                  created_at: true,
                  activity: {
                    id: true,
                  },
                },
              ],
            },
          },
        },
        {
          operationName:
            'search_contribtionsMentions_PostResultsBoard @cached(ttl: 60)',
        }
      );
      return matching;
    },
    {
      enabled: query != '' && !!currentUserAddress,
    }
  );

  if (isLoading) return <LoadingIndicator />;
  if (!data || data.length === 0) return <Text>No results</Text>;

  return (
    <Flex column css={{ gap: '$md', width: '100%' }}>
      {data.map((reply, idx: number) => {
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
              {reply.profile_public && (
                <CoLinksMember
                  profile={reply.profile_public}
                  size={'low_profile'}
                />
              )}
              <Flex
                as={NavLink}
                to={coLinksPaths.post(`${reply.activity?.id}`)}
                css={{
                  color: '$text',
                  textDecoration: 'none',
                }}
              >
                <Text size="xs" color="neutral" css={{ pl: '$lg' }}>
                  {DateTime.fromISO(reply.created_at).toLocal().toRelative()}
                </Text>
              </Flex>
            </Flex>
            <Flex
              as={NavLink}
              to={coLinksPaths.post(`${reply?.activity?.id}`)}
              css={{
                alignItems: 'flex-end',
                color: '$text',
                textDecoration: 'none',
                ml: '$sm',
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
                    description={shortenPost(reply.reply, query)}
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
