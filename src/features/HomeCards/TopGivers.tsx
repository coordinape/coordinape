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

export const TopGivers = () => {
  const { data, isLoading } = useQuery(['give_leaderboard'], async () => {
    const ascDesc = order_by.desc_nulls_last;
    const { colinks_gives_sent_skill_count } = await anonClient.query(
      {
        colinks_gives_sent_skill_count: [
          {
            order_by: [
              {
                ...{ gives: ascDesc },
              },
              {
                profiles_public: {
                  name: order_by.asc_nulls_last,
                },
              },
            ],
            limit: 5,
          },
          {
            profiles_public: {
              name: true,
              avatar: true,
              address: true,
            },
            gives_sent: true,
            gives_sent_last_24_hours: true,
            gives_sent_last_7_days: true,
            gives_sent_last_30_days: true,
          },
        ],
      },
      {
        operationName: 'getGiveLeaderboard',
      }
    );
    return colinks_gives_sent_skill_count.map((user, rank) => ({
      profile: user.profiles_public,
      ...user,
      rank: rank + 1,
    }));
  });

  if (!data || isLoading)
    return (
      <Flex column css={{ width: '100%', mb: '$1xl' }}>
        <LoadingIndicator />
      </Flex>
    );

  return (
    <>
      <Panel noBorder>
        <Text h2 display>
          Top GIVE Senders
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
              <GiveLeaderboardRow key={member.profile?.address}>
                <GiveLeaderboardColumn
                  css={{
                    minWidth: '12rem',
                  }}
                >
                  <Flex
                    as={NavLink}
                    to={coLinksPaths.profileGive(member.profile?.address ?? '')}
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
                      name={member.profile?.name}
                      path={member.profile?.avatar}
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
                        {member.profile?.name}
                      </Text>
                    </Flex>
                  </Flex>
                </GiveLeaderboardColumn>
                <GiveLeaderboardColumn css={{ justifyContent: 'flex-end' }}>
                  {member.gives}
                </GiveLeaderboardColumn>
              </GiveLeaderboardRow>
            ))}
        </Flex>
      </Panel>
    </>
  );
};
