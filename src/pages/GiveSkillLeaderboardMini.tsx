import { useQuery } from 'react-query';
import { NavLink, useParams } from 'react-router-dom';

import { Maximize } from '../icons/__generated';
import { order_by } from '../lib/anongql/__generated__/zeus';
import { anonClient } from '../lib/anongql/anonClient';
import { coLinksPaths } from '../routes/paths';
import { LoadingIndicator } from 'components/LoadingIndicator';
import { AppLink, Avatar, Button, Flex, Panel, Text } from 'ui';

import { GiveLeaderboardColumn, GiveLeaderboardRow } from './GiveLeaderboard';
import { AutosizedGiveGraph } from './NetworkViz/AutosizedGiveGraph';

export const rankColumnStyle = {
  minWidth: '2.7rem',
  maxWidth: '4rem',
};

export const GiveSkillLeaderboardMini = () => {
  const { skill } = useParams();

  const { data, isLoading } = useQuery(
    ['give_leaderboard', skill],
    async () => {
      const ascDesc = order_by.desc_nulls_last;
      const { colinks_gives_skill_count } = await anonClient.query(
        {
          colinks_gives_skill_count: [
            {
              where: {
                skill: {
                  _ilike: skill,
                },
              },
              order_by: [
                {
                  ...{ gives: ascDesc },
                },
                {
                  target_profile_public: {
                    name: order_by.asc_nulls_last,
                  },
                },
              ],
              limit: 5,
            },
            {
              target_profile_public: {
                name: true,
                avatar: true,
                address: true,
              },
              gives: true,
              gives_last_24_hours: true,
              gives_last_7_days: true,
              gives_last_30_days: true,
            },
          ],
        },
        {
          operationName: 'getGiveLeaderboard',
        }
      );
      return colinks_gives_skill_count.map((user, rank) => ({
        profile: user.target_profile_public,
        ...user,
        rank: rank + 1,
      }));
    }
  );

  if (!data || isLoading)
    return (
      <Flex column css={{ width: '100%', mb: '$1xl' }}>
        <LoadingIndicator />
      </Flex>
    );

  return (
    <>
      <Panel noBorder>
        {/*Table*/}
        <Flex
          css={{
            width: '100%',
            flexFlow: 'column',
            alignItems: 'flex-start',
          }}
        >
          <Flex
            css={{
              position: 'relative',
              height: 200,
              width: '100%',
              overflow: 'hidden',
              background: 'rgba(0,0,0,0.1)',
              borderRadius: '$2',
              mb: '$sm',
            }}
          >
            <AutosizedGiveGraph mapHeight={200} expand={false} skill={skill} />
            <Flex
              css={{
                position: 'absolute',
                bottom: '$sm',
                width: '100%',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Button
                as={NavLink}
                to={coLinksPaths.skillGiveMap(`${skill}`)}
                color={'cta'}
                size="xs"
              >
                <Maximize />
                Expand GIVE Map
              </Button>
            </Flex>
          </Flex>
          <Text
            semibold
            css={{
              width: '100%',
              mt: '$md',
              justifyContent: 'center',
            }}
          >
            Top GIVE
          </Text>
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
        {skill && (
          <AppLink
            inlineLink
            to={coLinksPaths.giveSkillLeaderboard(skill)}
            css={{
              width: '100%',
              textAlign: 'center',
              mt: '$md',
              fontSize: '$small',
              fontWeight: '$semibold',
            }}
          >
            View Leaderboard
          </AppLink>
        )}
      </Panel>
    </>
  );
};
