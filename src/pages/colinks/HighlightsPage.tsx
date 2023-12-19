import { DateTime } from 'luxon';
import { useQuery } from 'react-query';
import { NavLink } from 'react-router-dom';

import { LoadingIndicator } from '../../components/LoadingIndicator';
import { client } from '../../lib/gql/client';
import { coLinksPaths } from '../../routes/paths';
import { Avatar, Box, ContentHeader, Flex, Text } from '../../ui';
import { SingleColumnLayout } from '../../ui/layouts';

const HEADLINES_QUERY_KEY = 'headlines';

const getHeadlines = async () => {
  const { getHeadlines } = await client.query(
    {
      getHeadlines: {
        activity: {
          id: true,
          created_at: true,
          actor_profile_public: {
            avatar: true,
            name: true,
          },
        },
        description: true,
        headline: true,
      },
    },
    {
      operationName: 'getHeadlines @cached(ttl: 1440)',
    }
  );
  return getHeadlines;
};

export const HighlightsPage = () => {
  const { data: news } = useQuery([HEADLINES_QUERY_KEY], getHeadlines, {
    staleTime: 60 * 60 * 24,
  });

  return (
    <SingleColumnLayout>
      <ContentHeader>
        <Flex column css={{ gap: '$md' }}>
          <Text h2 display>
            AI Highlights
          </Text>
          <Text inline>AI generated highlights from your posts</Text>
        </Flex>
      </ContentHeader>

      {news === undefined ? (
        <Box>
          <Text h2>Generating AI highlights from your feed</Text>
          <Text>This may take a little while...</Text>
          <LoadingIndicator />
        </Box>
      ) : (
        <Flex
          css={{
            width: '100%',
            flexWrap: 'wrap',
            gap: '$md',
          }}
        >
          {news.map(
            item =>
              item.activity && (
                <Flex
                  css={{
                    gap: '$sm',
                    flexWrap: 'wrap',
                    width: '45%',
                    p: '$md',
                  }}
                  key={item.activity.id}
                >
                  <Flex
                    column
                    as={NavLink}
                    to={coLinksPaths.post(`${item.activity.id}`)}
                    css={{
                      color: '$text',
                      textDecoration: 'none',
                      gap: '$sm',
                    }}
                  >
                    <Text h2>{item.headline}</Text>
                    <Flex>
                      <Avatar
                        path={item.activity?.actor_profile_public?.avatar}
                        size="small"
                        name={item.activity?.actor_profile_public?.name}
                      />
                      <Text css={{ pl: '$md' }}>
                        {item.activity?.actor_profile_public?.name}
                      </Text>
                      <Text size="small" css={{ color: '$neutral', ml: '$md' }}>
                        {DateTime.fromISO(
                          item.activity.created_at
                        ).toRelative()}
                      </Text>
                    </Flex>
                    <Text>{item.description}</Text>
                  </Flex>
                </Flex>
              )
          )}
        </Flex>
      )}
    </SingleColumnLayout>
  );
};
