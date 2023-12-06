/* eslint-disable @typescript-eslint/no-unused-vars */
import { useQuery } from 'react-query';
import { NavLink } from 'react-router-dom';

import CopyCodeTextField from '../../components/CopyCodeTextField';
import { LoadingIndicator } from '../../components/LoadingIndicator';
import { Check } from '../../icons/__generated';
import { order_by } from '../../lib/gql/__generated__/zeus';
import { client } from '../../lib/gql/client';
import { coLinksPaths } from '../../routes/paths';
import { AppLink, Avatar, ContentHeader, Flex, Panel, Text } from '../../ui';
import { SingleColumnLayout } from '../../ui/layouts';

const HEADLINES_QUERY_KEY = 'headlines';

const getHeadlines = async () => {
  const { getHeadlines } = await client.query(
    {
      getHeadlines: [
        {
          payload: { address: '0x756bD520e6d52BA027E7a1b3cD59f79ab61DFC34' },
        },
        {
          activity_id: true,
          description: true,
          headline: true,
        },
      ],
    },
    {
      operationName: 'getHeadlines',
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
        <Flex css={{ width: '100%', gap: '$md' }}>
          <Flex column css={{ flex: 1, gap: '$md' }}>
            <Flex column css={{ gap: '$md' }}>
              {news.map(item => (
                <Panel key={item.activity_id}>
                  <Flex css={{ gap: '$md' }}>
                    <Flex
                      as={NavLink}
                      to={coLinksPaths.post(`${item.activity_id}`)}
                      css={{
                        alignItems: 'flex-end',
                        color: '$text',
                        textDecoration: 'none',
                      }}
                    >
                      <Flex column css={{ gap: '$sm' }}>
                        <Text h2>{item.headline}</Text>
                        <Text>{item.description}</Text>
                      </Flex>
                    </Flex>
                  </Flex>
                </Panel>
              ))}
            </Flex>
          </Flex>
        </Flex>
      )}
    </SingleColumnLayout>
  );
};
