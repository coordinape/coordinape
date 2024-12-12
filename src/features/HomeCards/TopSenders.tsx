import { order_by } from 'lib/anongql/__generated__/zeus';
import { anonClient } from 'lib/anongql/anonClient';
import { useQuery } from 'react-query';
import { NavLink } from 'react-router-dom';

import { Avatar, Button, Flex, Panel, Text } from '../../ui';
import { LoadingIndicator } from 'components/LoadingIndicator';
import { QUERY_KEY_GIVE_HOME } from 'pages/GiveHome';
import { coLinksPaths } from 'routes/paths';

export const TopSenders = () => {
  const { data, isLoading } = useQuery(
    [QUERY_KEY_GIVE_HOME, 'profiles', 'topSenders'],
    async () => {
      const { most_give } = await anonClient.query(
        {
          __alias: {
            most_give: {
              profiles_public: [
                {
                  order_by: [
                    {
                      colinks_given_aggregate: {
                        count: order_by.desc_nulls_last,
                      },
                      name: order_by.desc,
                    },
                  ],
                  limit: 6,
                },
                {
                  id: true,
                  name: true,
                  address: true,
                  avatar: true,
                  colinks_given_aggregate: [
                    {},
                    { aggregate: { count: [{}, true] } },
                  ],
                },
              ],
            },
          },
        },
        {
          operationName: 'coLinks_giveHome_topSenders @cached(ttl: 30)',
        }
      );
      return most_give;
    }
  );

  if (!data || isLoading)
    return (
      <Flex column css={{ width: '100%' }}>
        <LoadingIndicator />
      </Flex>
    );

  return (
    <>
      <Panel
        noBorder
        css={{
          background:
            'radial-gradient(circle at 8% 0%, $tagSuccessBackground 20%, $tagCtaBackground 100%)',
        }}
      >
        <Text h2 css={{ justifyContent: 'center' }}>
          Top GIVE Senders
        </Text>
        <Flex
          row
          css={{
            width: '100%',
            alignItems: 'flex-start',
            flex: 1,
            mt: '$md',
            gap: '$md',
            flexWrap: 'wrap',
          }}
        >
          {data &&
            data
              .filter(
                member =>
                  member.colinks_given_aggregate?.aggregate?.count ?? 0 > 0
              )
              .map(member => (
                <Flex
                  row
                  key={member?.address}
                  css={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Flex
                    as={NavLink}
                    to={coLinksPaths.profileGive(member.address ?? '')}
                    column
                    css={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '$sm',
                      textDecoration: 'none',
                      color: '$text',
                    }}
                  >
                    <Avatar
                      size={'xl'}
                      name={member.name}
                      path={member.avatar}
                    />
                    <Flex column>
                      <Text
                        semibold
                        size="medium"
                        css={{
                          maxWidth: '10rem',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          display: 'inline',
                        }}
                      >
                        {member.name}
                      </Text>
                    </Flex>
                  </Flex>
                </Flex>
              ))}
        </Flex>
        <Flex css={{ justifyContent: 'center', width: '100%', mt: '$md' }}>
          <Button as={NavLink} to={coLinksPaths.giveSenders} color="secondary">
            View Leaderboard
          </Button>
        </Flex>
      </Panel>
    </>
  );
};
