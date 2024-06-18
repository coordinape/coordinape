import { useEffect, useState } from 'react';

import { useQuery } from 'react-query';
import { NavLink, useParams } from 'react-router-dom';

import { webAppURL } from '../config/webAppURL';
import { Wand } from '../icons/__generated';
import { order_by } from '../lib/anongql/__generated__/zeus';
import { anonClient } from '../lib/anongql/anonClient';
import { coLinksPaths } from '../routes/paths';
import { disabledStyle } from '../stitches.config';
import { shortenAddressWithFrontLength } from '../utils';
import { Avatar, Button, Flex, Link, Text } from 'ui';
import { PartyDisplayText } from 'ui/Tooltip/PartyDisplayText';

import { GiveLeaderboardColumn, GiveLeaderboardRow } from './GiveLeaderboard';
import { PartyBody } from './GiveParty/PartyBody';
import { PartyHeader } from './GiveParty/PartyHeader';
import { GiveGraph } from './NetworkViz/GiveGraph';

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

  const castLeaderboardUrl = `https://warpcast.com/~/compose?text=${encodeURIComponent(skill ? '#' + skill + ' GIVE Leaders' : '')}&embeds[]=${webAppURL('colinks')}/api/frames/router/meta/skill.leaderboard/${encodeURIComponent(skill ?? '')}`;
  return (
    <>
      <PartyBody css={{ gap: '$lg' }}>
        <PartyHeader />
        <Flex
          css={{
            justifyContent: 'center',
          }}
        >
          <Button
            as={Link}
            href={castLeaderboardUrl}
            target="_blank"
            rel="noreferrer"
            css={{
              ...(!skill && {
                ...disabledStyle,
              }),
            }}
          >
            <Wand fa size={'md'} /> Cast in Farcaster
          </Button>
        </Flex>

        {/*Content*/}
        <Flex
          css={{
            padding: '16px',
            backgroundColor: 'rgb(8 18 29 / 25%)',
            borderRadius: '$2',
            // border: 'solid 1px #424a51',
            '@tablet': {
              p: '12px 8px',
            },
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
            <Text
              h2
              css={{
                width: '100%',
                justifyContent: 'center',
                m: '$xs 0 $md',
                alignItems: 'baseline',
                gap: '$xs',
              }}
            >
              <PartyDisplayText text={`#${skill}`} />
              <Text semibold>GIVEs</Text>
            </Text>

            <Flex
              css={{
                position: 'relative',
                height: 200,
                width: '100%',
                overflow: 'hidden',
                background: 'rgba(0,0,0,0.3)',
                borderRadius: '$2',
                mb: '$sm',
              }}
            >
              <GiveGraph
                skill={skill}
                height={200}
                zoom={false}
                compact={true}
              />
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
                  to={coLinksPaths.giveSkillMap(`${skill}`)}
                  color={'cta'}
                  size="xs"
                >
                  Expand View
                </Button>
              </Flex>
            </Flex>

            <GiveLeaderboardRow rotateHeader header={true}>
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
                    minWidth: '10rem',
                  },
                }}
              >
                Member
              </GiveLeaderboardColumn>
              <GiveLeaderboardColumn onClick={() => setSort('gives')}>
                Total GIVEs
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
                        minWidth: '10rem',
                      },
                    }}
                  >
                    <Flex
                      as={NavLink}
                      to={coLinksPaths.partyProfile(
                        member.profile?.address ?? ''
                      )}
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
                  <GiveLeaderboardColumn>{member.gives}</GiveLeaderboardColumn>
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
      </PartyBody>
    </>
  );
};
