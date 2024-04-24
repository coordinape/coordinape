import { useEffect, useState } from 'react';

import { useQuery } from 'react-query';
import { NavLink, useParams } from 'react-router-dom';

import { order_by } from '../lib/anongql/__generated__/zeus';
import { anonClient } from '../lib/anongql/anonClient';
import { coLinksPaths } from '../routes/paths';
import { shortenAddressWithFrontLength } from '../utils';
import { GemCoOutline } from 'icons/__generated';
import { Avatar, Flex, Text } from 'ui';

import { GiveLeaderboardColumn, GiveLeaderboardRow } from './GiveLeaderboard';

type sortBy =
  | 'gives'
  | 'rank'
  | 'gives_last_24_hours'
  | 'gives_last_7_days'
  | 'gives_last_30_days'
  | 'name';

export const GiveSkillLeaderboard = () => {
  const { skill } = useParams();
  const [sort, setSortRaw] = useState<sortBy>('gives');
  const [desc, setDesc] = useState<boolean>(true);

  const setSort = (newSort: sortBy) => {
    if (newSort === sort) {
      setDesc(prev => !prev);
    } else {
      setDesc(true);
      setSortRaw(newSort);
    }
  };

  const { data } = useQuery(['give_leaderboard'], async () => {
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
                gives: order_by.desc_nulls_last,
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
  });

  const [sortedData, setSortedData] = useState<typeof data>(undefined);

  const nameCompare = (a: string, b: string) => {
    if (!a && !b) {
      return 0;
    } else if (!a && b) {
      return -1;
    } else if (a && !b) {
      return 1;
    }
    return a.localeCompare(b);
  };

  useEffect(() => {
    // Change safari header bar color
    const metaThemeColor = document.querySelector(
      'meta[name="theme-color"]'
    ) as HTMLMetaElement;
    metaThemeColor.content = '#5507E7';
    // Revert to original value on unmount
    return () => {
      if (metaThemeColor) {
        metaThemeColor.content = '#000000';
      }
    };
  }, []);

  useEffect(() => {
    if (data) {
      data.sort((a, b) => {
        if (sort === 'name') {
          return nameCompare(a.profile?.name ?? '', b.profile?.name ?? '');
        }
        const diff = b[sort] - a[sort];
        if (diff !== 0) {
          return diff;
        }
        return nameCompare(a.profile?.name ?? '', b.profile?.name ?? '');
      });
      setSortedData(desc ? [...data] : [...data].reverse());
    }
  }, [data, sort, desc]);

  return (
    <>
      <Flex
        key={sort}
        column
        css={{
          height: '100vh',
          width: '100%',
          borderTop: '1px solid #4906C7',
          background:
            'radial-gradient(circle at 25% 0%, #5507E7 20%, #E7A607 100%)',
          alignItems: 'center',
          position: 'fixed',
          overflow: 'scroll',
          paddingBottom: 100,
          '@sm': {
            fontSize: '$xs',
          },
          '*': {
            color: 'white',
          },
        }}
      >
        <Flex
          css={{
            position: 'relative',
            width: '80%',
            margin: 'auto',
            gap: '$2xl',
            flexFlow: 'column nowrap',
            '@md': {
              width: '96%',
            },
          }}
        >
          <Flex column css={{ alignItems: 'center', paddingTop: '80px' }}>
            <Flex row css={{ gap: '$md' }}>
              <Text css={{ color: '#FFFFFF' }} size={'large'}>
                give.party
              </Text>
              <GemCoOutline size="2xl" fa />
              <Text css={{ color: '#FFFFFF' }} size={'large'}>
                leaderboard
              </Text>
            </Flex>
          </Flex>

          {/*Content*/}
          <Flex
            css={{
              padding: '16px',
              backgroundColor: 'rgb(8 18 29 / 25%)',
              borderRadius: '$2',
              // border: 'solid 1px #424a51',
            }}
          >
            {/*Table*/}
            <Flex
              css={{
                width: '100%',
                flexFlow: 'column',
                alignItems: 'flex-start',
                color: 'white',
              }}
            >
              <GiveLeaderboardRow header={true}>
                <GiveLeaderboardColumn
                  onClick={() => setSort('rank')}
                  css={{ maxWidth: '4rem' }}
                >
                  Rank
                </GiveLeaderboardColumn>
                <GiveLeaderboardColumn
                  onClick={() => setSort('name')}
                  css={{
                    minWidth: '15rem',
                    '@md': {
                      minWidth: '12rem',
                    },
                  }}
                >
                  Member
                </GiveLeaderboardColumn>
                <GiveLeaderboardColumn onClick={() => setSort('gives')}>
                  Total #{skill} GIVEs
                </GiveLeaderboardColumn>
                <GiveLeaderboardColumn
                  onClick={() => setSort('gives_last_24_hours')}
                >
                  Last 24 Hrs
                </GiveLeaderboardColumn>
                <GiveLeaderboardColumn
                  onClick={() => setSort('gives_last_7_days')}
                >
                  Last 7 Days
                </GiveLeaderboardColumn>
                <GiveLeaderboardColumn
                  onClick={() => setSort('gives_last_30_days')}
                >
                  Last 30 Days
                </GiveLeaderboardColumn>
              </GiveLeaderboardRow>
              {sortedData &&
                sortedData.map(member => (
                  <GiveLeaderboardRow key={member.profile?.address}>
                    <GiveLeaderboardColumn css={{ maxWidth: '4rem' }}>
                      #{member.rank}
                    </GiveLeaderboardColumn>
                    <GiveLeaderboardColumn
                      css={{
                        minWidth: '15rem',
                        '@md': {
                          minWidth: '12rem',
                        },
                      }}
                    >
                      <Flex
                        as={NavLink}
                        to={coLinksPaths.profile(member.profile?.address ?? '')}
                        row
                        css={{
                          alignItems: 'center',
                          gap: '$sm',
                          textDecoration: 'none',
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
                      {member.gives}
                    </GiveLeaderboardColumn>
                    <GiveLeaderboardColumn>
                      {member.gives_last_24_hours}
                    </GiveLeaderboardColumn>
                    <GiveLeaderboardColumn>
                      {member.gives_last_7_days}
                    </GiveLeaderboardColumn>
                    <GiveLeaderboardColumn>
                      {member.gives_last_30_days}
                    </GiveLeaderboardColumn>
                  </GiveLeaderboardRow>
                ))}
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </>
  );
};
