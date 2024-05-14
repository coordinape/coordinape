/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react';

import { ActivityAvatar } from 'features/activities/ActivityAvatar';
import { groupAndSortGive } from 'features/points/PostGives';
import { anonClient } from 'lib/anongql/anonClient';
import { useQuery } from 'react-query';
import { NavLink } from 'react-router-dom';
import { skillTextStyle } from 'stitches.config';

import { Flex, Text, Popover, PopoverContent, PopoverTrigger } from '../../ui';
import { GemCoOutline, Users } from 'icons/__generated';
import {
  GiveLeaderboardColumn,
  GiveLeaderboardRow,
} from 'pages/GiveLeaderboard';
import { coLinksPaths } from 'routes/paths';

type sortBy = 'gives' | 'skill';

export const PartyProfileGives = ({ profileId }: { profileId: number }) => {
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

  const { data } = useQuery(
    ['skill_counts', profileId],
    async () => {
      const { colinks_gives } = await anonClient.query(
        {
          colinks_gives: [
            {
              where: {
                target_profile_id: {
                  _eq: profileId,
                },
              },
            },
            {
              id: true,
              skill: true,
              profile_id: true,
              activity_id: true,
              giver_profile_public: {
                name: true,
                id: true,
                address: true,
                avatar: true,
              },
            },
          ],
        },
        {
          operationName: 'getGiveReceived',
        }
      );

      return groupAndSortGive(colinks_gives);
    },
    {
      enabled: !!profileId,
    }
  );

  const [sortedData, setSortedData] = useState<typeof data>(undefined);

  const skillCompare = (a: any, b: any) => {
    if (!a.skill && !b.skill) {
      return 0;
    } else if (!a.skill && b.skill) {
      return -1;
    } else if (a.skill && !b.skill) {
      return 1;
    }
    return a.skill.localeCompare(b.skill);
  };

  useEffect(() => {
    if (data) {
      data.sort((a, b) => {
        if (sort === 'skill') {
          return skillCompare(a, b);
        }
        const diff = b.gives.length - a.gives.length;
        if (diff !== 0) {
          return diff;
        }
        return skillCompare(a, b);
      });
      setSortedData(desc ? [...data] : [...data].reverse());
    }
  }, [data, sort, desc]);

  return (
    <>
      {/* Table */}
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
            onClick={() => setSort('skill')}
            css={{
              minWidth: '16rem',
            }}
          >
            Skill
          </GiveLeaderboardColumn>
          <GiveLeaderboardColumn onClick={() => setSort('gives')}>
            GIVE
          </GiveLeaderboardColumn>
          <GiveLeaderboardColumn>Givers</GiveLeaderboardColumn>
        </GiveLeaderboardRow>
        {sortedData &&
          sortedData.map(skill => {
            const seenNames = new Set<string>();
            const uniqueGives = skill.gives.filter(give => {
              const name = give.giver_profile_public?.name;
              if (name && !seenNames.has(name)) {
                seenNames.add(name);
                return true;
              }
              return false;
            });

            return (
              <GiveLeaderboardRow key={skill.skill}>
                <GiveLeaderboardColumn
                  css={{
                    minWidth: '16rem',
                  }}
                >
                  <Text
                    as={NavLink}
                    to={coLinksPaths.giveBoardSkill(skill.skill)}
                    tag
                    size="small"
                    css={{
                      gap: '$xs',
                      background: 'rgb(0 143 94 / 83%)',
                      textDecoration: 'none',
                      span: {
                        color: 'white',
                        '@sm': {
                          fontSize: '$xs',
                        },
                      },
                    }}
                  >
                    <GemCoOutline fa size={'md'} css={{ color: '$text' }} />
                    <Text size="medium" css={{ ...skillTextStyle }}>
                      {skill.skill}
                    </Text>
                  </Text>
                </GiveLeaderboardColumn>
                <GiveLeaderboardColumn>
                  {skill.gives.length}
                </GiveLeaderboardColumn>
                <GiveLeaderboardColumn>
                  <Popover>
                    <PopoverTrigger css={{ cursor: 'pointer' }}>
                      <Users fa />
                    </PopoverTrigger>
                    <PopoverContent css={{ background: 'black', p: '$sm $md' }}>
                      <Flex column css={{ gap: '$sm' }}>
                        {uniqueGives.map(
                          give =>
                            give.giver_profile_public && (
                              <Flex
                                key={give.giver_profile_public.address}
                                css={{ alignItems: 'center', gap: '$sm' }}
                              >
                                <>
                                  <ActivityAvatar
                                    size="xs"
                                    profile={give.giver_profile_public}
                                  />
                                  <Text
                                    size="small"
                                    semibold
                                    css={{ textDecoration: 'none' }}
                                    as={NavLink}
                                    to={coLinksPaths.partyProfile(
                                      give.giver_profile_public.address || ''
                                    )}
                                  >
                                    {give.giver_profile_public?.name}
                                  </Text>
                                </>
                              </Flex>
                            )
                        )}
                      </Flex>
                    </PopoverContent>
                  </Popover>
                </GiveLeaderboardColumn>
              </GiveLeaderboardRow>
            );
          })}
      </Flex>
    </>
  );
};
