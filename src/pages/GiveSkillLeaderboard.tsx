import { useState } from 'react';

import { useQuery } from 'react-query';
import { NavLink, useParams } from 'react-router-dom';
import { skillTextStyle } from 'stitches.config';

import { Maximize } from '../icons/__generated';
import { order_by } from '../lib/anongql/__generated__/zeus';
import { anonClient } from '../lib/anongql/anonClient';
import { coLinksPaths } from '../routes/paths';
import { shortenAddressWithFrontLength } from '../utils';
import { LoadingIndicator } from 'components/LoadingIndicator';
import { Avatar, Button, Flex, Panel, Text } from 'ui';

import { GiveLeaderboardColumn, GiveLeaderboardRow } from './GiveLeaderboard';
import { AutosizedGiveGraph } from './NetworkViz/AutosizedGiveGraph';

type sortBy =
  | 'gives'
  | 'rank'
  | 'gives_last_24_hours'
  | 'gives_last_7_days'
  | 'gives_last_30_days'
  | 'name';

export const rankColumnStyle = {
  minWidth: '2.7rem',
  maxWidth: '4rem',
};

export const GiveSkillLeaderboard = () => {
  const { skill } = useParams();
  const [sort, setSortRaw] = useState<sortBy>('gives_last_7_days');
  const [desc, setDesc] = useState<boolean>(true);

  const setSort = (newSort: sortBy) => {
    if (newSort === sort) {
      setDesc(prev => !prev);
    } else {
      setDesc(true);
      setSortRaw(newSort);
    }
  };

  const { data, isLoading } = useQuery(
    ['give_leaderboard', skill, sort, desc],
    async () => {
      const ascDesc = desc ? order_by.desc_nulls_last : order_by.asc_nulls_last;
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
                  ...(sort === 'gives_last_24_hours'
                    ? { gives_last_24_hours: ascDesc }
                    : sort === 'gives_last_7_days'
                      ? { gives_last_7_days: ascDesc }
                      : sort === 'gives_last_30_days'
                        ? { gives_last_30_days: ascDesc }
                        : sort === 'name'
                          ? {
                              target_profile_public: {
                                name: ascDesc,
                              },
                            }
                          : { gives: ascDesc }),
                },
                {
                  target_profile_public: {
                    name: order_by.asc_nulls_last,
                  },
                },
              ],
              limit: 100,
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
      {/*Content*/}
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
            column
            css={{
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
              mb: '$md',
              borderRadius: '$3',
              background: 'linear-gradient(90deg, $complete 25%, $cta 80%)',
              p: '$md',
              color: '$textOnCta',
            }}
          >
            <Text
              h2
              display
              css={{
                ...skillTextStyle,
                maxWidth: '300px',
                color: '$textOnCta',
                pb: '$xs',
                borderBottom: '1px solid $black20',
              }}
            >{`#${skill}`}</Text>
            <Text
              size="small"
              css={{
                mt: '$sm',
                height: 'auto',
                color: '$textOnCta',
              }}
            >
              Top GIVE
            </Text>
          </Flex>

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

          <GiveLeaderboardRow rotateHeader header={true}>
            <GiveLeaderboardColumn
              onClick={() => setSort('rank')}
              css={rankColumnStyle}
            >
              Rank
            </GiveLeaderboardColumn>
            <GiveLeaderboardColumn
              onClick={() => setSort('name')}
              css={{
                minWidth: '15rem',
                '@md': {
                  minWidth: '10rem',
                },
              }}
            >
              Member
            </GiveLeaderboardColumn>
            <GiveLeaderboardColumn onClick={() => setSort('gives_last_7_days')}>
              Last 7d
            </GiveLeaderboardColumn>
            <GiveLeaderboardColumn
              onClick={() => setSort('gives_last_24_hours')}
            >
              Last 24h
            </GiveLeaderboardColumn>
            <GiveLeaderboardColumn
              onClick={() => setSort('gives_last_30_days')}
            >
              Last 30d
            </GiveLeaderboardColumn>
            <GiveLeaderboardColumn onClick={() => setSort('gives')}>
              Total GIVEs
            </GiveLeaderboardColumn>
          </GiveLeaderboardRow>
          {data &&
            data.map(member => (
              <GiveLeaderboardRow key={member.profile?.address}>
                <GiveLeaderboardColumn css={rankColumnStyle}>
                  #{member.rank}
                </GiveLeaderboardColumn>
                <GiveLeaderboardColumn
                  css={{
                    minWidth: '15rem',
                    '@md': {
                      minWidth: '10rem',
                    },
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
                      <Text size="medium">{member.profile?.name}</Text>
                      <Text size={'xs'}>
                        {shortenAddressWithFrontLength(
                          member.profile?.address ?? '',
                          10
                        )}
                      </Text>
                    </Flex>
                  </Flex>
                </GiveLeaderboardColumn>
                <GiveLeaderboardColumn>
                  {member.gives_last_7_days}
                </GiveLeaderboardColumn>
                <GiveLeaderboardColumn>
                  {member.gives_last_24_hours}
                </GiveLeaderboardColumn>
                <GiveLeaderboardColumn>
                  {member.gives_last_30_days}
                </GiveLeaderboardColumn>
                <GiveLeaderboardColumn>{member.gives}</GiveLeaderboardColumn>
              </GiveLeaderboardRow>
            ))}
        </Flex>
      </Panel>
    </>
  );
};
