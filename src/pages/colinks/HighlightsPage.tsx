import { DateTime } from 'luxon';
import { Helmet } from 'react-helmet';
import { useQuery } from 'react-query';
import { NavLink } from 'react-router-dom';

import { LoadingIndicator } from '../../components/LoadingIndicator';
import { client } from '../../lib/gql/client';
import { coLinksPaths } from '../../routes/paths';
import { Avatar, ContentHeader, Flex, Panel, Text } from '../../ui';
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
    staleTime: 1000 * 60 * 60, // 1 hour in ms
  });

  return (
    <SingleColumnLayout>
      <Helmet>
        <title>Highlights / CoLinks</title>
      </Helmet>
      <ContentHeader>
        <Flex column css={{ gap: '$md' }}>
          <Text h2 display>
            AI Highlights
          </Text>
          <Text>AI generated highlights from your connections.</Text>
          <Text>
            Heads up... this page is for fun, and AI may halucinate or
            misrepresent content.
          </Text>
        </Flex>
      </ContentHeader>
      {news === undefined ? (
        <Panel
          css={{
            gap: '$sm',
            p: 0,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            border: 'none',
            overflow: 'clip',
            width: '100%',
            maxWidth: '550px',
            margin: 'auto',
            mt: '$lg',
          }}
        >
          <Flex
            css={{
              flexGrow: 1,
              height: '100%',
              width: 'auto',
              minHeight: '120px',
              aspectRatio: '1/1',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              backgroundSize: 'cover',
              backgroundImage: "url('/imgs/background/colink-ai.jpg')",
            }}
          />
          <Flex
            column
            css={{
              flex: 2,
              gap: '$md',
              alignItems: 'center',
              p: '$md',
              color: '$text',
              '*': {
                textAlign: 'center',
              },
            }}
          >
            <Text h2>
              Generating AI highlights <br />
              from your feed
            </Text>
            <Text>This may take a little while...</Text>
            <LoadingIndicator />
          </Flex>
        </Panel>
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
                    '@tablet': {
                      width: '100%',
                    },
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
                      p: '$md',
                      borderRadius: '$3',
                      '&:hover, &:focus': {
                        background: '$surface',
                      },
                      '@tablet': {
                        px: 0,
                      },
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
