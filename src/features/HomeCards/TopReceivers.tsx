import { order_by } from 'lib/anongql/__generated__/zeus';
import { anonClient } from 'lib/anongql/anonClient';
import { useQuery } from 'react-query';
import { NavLink } from 'react-router-dom';

import { Avatar, Flex, Panel, Text } from '../../ui';
import { LoadingIndicator } from 'components/LoadingIndicator';
import {
  GiveLeaderboardColumn,
  GiveLeaderboardRow,
} from 'pages/GiveLeaderboard';
import { coLinksPaths } from 'routes/paths';

export const TopReceivers = () => {
  const { data, isLoading } = useQuery(
    ['home2', 'profiles', 'top_receivers'],
    async () => {
      const { most_give } = await anonClient.query(
        {
          __alias: {
            most_give: {
              profiles_public: [
                {
                  order_by: [
                    {
                      colinks_gives_aggregate: {
                        count: order_by.desc_nulls_last,
                      },
                      name: order_by.desc,
                    },
                  ],
                  limit: 5,
                },
                {
                  id: true,
                  name: true,
                  address: true,
                  avatar: true,
                  colinks_gives_aggregate: [
                    {},
                    { aggregate: { count: [{}, true] } },
                  ],
                },
              ],
            },
          },
        },
        {
          operationName: 'coLinks_giveHome_topReceivers @cached(ttl: 60)',
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
      <Panel noBorder>
        <Text h2 display>
          Top GIVE Receivers
        </Text>
        {/*Table*/}
        <Flex
          css={{
            width: '100%',
            flexFlow: 'column',
            alignItems: 'flex-start',
          }}
        >
          {data &&
            data.map(member => (
              <GiveLeaderboardRow key={member?.address}>
                <GiveLeaderboardColumn
                  css={{
                    minWidth: '12rem',
                  }}
                >
                  <Flex
                    as={NavLink}
                    to={coLinksPaths.profileGive(member.address ?? '')}
                    row
                    css={{
                      alignItems: 'center',
                      gap: '$sm',
                      textDecoration: 'none',
                      color: '$link',
                    }}
                  >
                    <Avatar
                      size={'xs'}
                      name={member.name}
                      path={member.avatar}
                    />
                    <Flex column>
                      <Text
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
                </GiveLeaderboardColumn>
                <GiveLeaderboardColumn css={{ justifyContent: 'flex-end' }}>
                  {member.colinks_gives_aggregate?.aggregate?.count}
                </GiveLeaderboardColumn>
              </GiveLeaderboardRow>
            ))}
        </Flex>
      </Panel>
    </>
  );
};
