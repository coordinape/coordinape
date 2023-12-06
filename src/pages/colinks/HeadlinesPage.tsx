import { DateTime } from 'luxon';
import { useQuery } from 'react-query';
import { NavLink } from 'react-router-dom';

import { LoadingIndicator } from '../../components/LoadingIndicator';
import { client } from '../../lib/gql/client';
import { coLinksPaths } from '../../routes/paths';
import { Avatar, ContentHeader, Flex, Text } from '../../ui';
import { SingleColumnLayout } from '../../ui/layouts';

const HEADLINES_QUERY_KEY = 'headlines';

const getHeadlines = async () => {
  const { getHeadlines } = await client.query(
    {
      getHeadlines: {
        activity: {
          id: true,
          created_at: true,
          actor_profile: {
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

export const HeadlinesPage = () => {
  const { data: news } = useQuery([HEADLINES_QUERY_KEY], getHeadlines, {
    staleTime: 60 * 60 * 24,
  });

  return (
    <SingleColumnLayout>
      <ContentHeader>
        <Flex column>
          <Text h2 display>
            News From CoLinks
          </Text>
          <Text inline>AI Generated news</Text>
        </Flex>
      </ContentHeader>

      {news === undefined ? (
        <LoadingIndicator />
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
                    borderRadius: '$3',
                    p: '$md',
                    border: '1px solid $border',
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
                    }}
                  >
                    <Text h2>{item.headline}</Text>
                    <Flex row>
                      <Avatar
                        path={item.activity?.actor_profile?.avatar}
                        size="small"
                        name={item.activity?.actor_profile?.name}
                      />
                      <Text css={{ pl: '$md' }}>
                        {item.activity?.actor_profile?.name}
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
