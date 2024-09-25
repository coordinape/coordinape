import { useEffect, useState } from 'react';

import { CSS } from '@stitches/react';
import { useQuery } from 'react-query';
import { NavLink } from 'react-router-dom';

import { order_by } from '../lib/anongql/__generated__/zeus';
import { anonClient } from '../lib/anongql/anonClient';
import { coLinksPaths } from '../routes/paths';
import { skillTextStyle } from '../stitches.config';
import { GemCoOutline } from 'icons/__generated';
import { Flex, Panel, Text } from 'ui';

type sortBy =
  | 'gives'
  | 'rank'
  | 'gives_last_24_hours'
  | 'gives_last_7_days'
  | 'gives_last_30_days'
  | 'skill';

export const GiveLeaderboard = () => {
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
    const { colinks_give_count } = await anonClient.query(
      {
        colinks_give_count: [
          {
            order_by: [
              {
                gives: order_by.desc_nulls_last,
              },
              {
                skill: order_by.asc_nulls_last,
              },
            ],
            limit: 100,
          },
          {
            skill: true,
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
    return colinks_give_count.map((skill, rank) => ({
      ...skill,
      rank: rank + 1,
    }));
  });

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
        const diff = b[sort] - a[sort];
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
              gap: '$xs',
            }}
          >
            <Flex
              css={{
                alignItems: 'center',
                gap: '$xs',
                pb: '$sm',
                borderBottom: '1px solid $black20',
              }}
            >
              <GemCoOutline fa size="xl" />
              <Text
                h2
                display
                css={{
                  color: '$textOnCta',
                }}
              >
                GIVE
              </Text>
            </Flex>
            <Text
              size="small"
              css={{
                mt: '$xs',
                height: 'auto',
                color: '$textOnCta',
              }}
            >
              Leaderboard
            </Text>
          </Flex>
          <GiveLeaderboardRow rotateHeader header={true}>
            <GiveLeaderboardColumn
              onClick={() => setSort('rank')}
              css={{ maxWidth: '4rem' }}
            >
              Rank
            </GiveLeaderboardColumn>
            <GiveLeaderboardColumn
              onClick={() => setSort('skill')}
              css={{
                minWidth: '15rem',
                '@md': {
                  minWidth: '12rem',
                  // flexGrow: 1,
                },
              }}
            >
              Skill
            </GiveLeaderboardColumn>
            <GiveLeaderboardColumn onClick={() => setSort('gives')}>
              Total GIVEs
            </GiveLeaderboardColumn>
            <GiveLeaderboardColumn
              onClick={() => setSort('gives_last_24_hours')}
            >
              Last 24 Hrs
            </GiveLeaderboardColumn>
            <GiveLeaderboardColumn onClick={() => setSort('gives_last_7_days')}>
              Last 7 Days
            </GiveLeaderboardColumn>
            <GiveLeaderboardColumn
              onClick={() => setSort('gives_last_30_days')}
            >
              Last 30 Days
            </GiveLeaderboardColumn>
          </GiveLeaderboardRow>
          {sortedData &&
            sortedData.map(skill => (
              <GiveLeaderboardRow key={skill.rank}>
                <GiveLeaderboardColumn css={{ maxWidth: '4rem' }}>
                  #{skill.rank}
                </GiveLeaderboardColumn>
                <GiveLeaderboardColumn
                  css={{
                    minWidth: '15rem',
                    '@md': {
                      minWidth: '12rem',
                      // flexGrow: 1,
                    },
                  }}
                >
                  <Text
                    as={NavLink}
                    to={coLinksPaths.giveSkill(skill.skill)}
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
                    <GemCoOutline fa size={'md'} css={{ color: '$white' }} />
                    <Text css={{ ...skillTextStyle }}>{skill.skill}</Text>
                  </Text>
                </GiveLeaderboardColumn>
                <GiveLeaderboardColumn>{skill.gives}</GiveLeaderboardColumn>
                <GiveLeaderboardColumn>
                  {skill.gives_last_24_hours}
                </GiveLeaderboardColumn>
                <GiveLeaderboardColumn>
                  {skill.gives_last_7_days}
                </GiveLeaderboardColumn>
                <GiveLeaderboardColumn>
                  {skill.gives_last_30_days}
                </GiveLeaderboardColumn>
              </GiveLeaderboardRow>
            ))}
        </Flex>
      </Panel>
    </>
  );
};

export const GiveLeaderboardRow = ({
  children,
  header,
  rotateHeader = false,
  css,
}: {
  children: React.ReactNode;
  header?: boolean;
  rotateHeader?: boolean;
  css?: CSS;
}) => {
  return (
    <Flex
      css={{
        width: '100%',
        flexFlow: 'row nowrap',
        alignItems: 'stretch',
        borderBottom: 'solid 1px rgba(0,0,0,0.2)',
        fontWeight: '300',
        ...(header
          ? {
              border: 'none',
              position: 'sticky',
              cursor: 'pointer',
              top: 0,
              fontWeight: '700',
              borderRadius: '$2',
              zIndex: 2,
              background: '$surfaceNested',
              minHeight: '50px',
              '@xs': {
                fontSize: '$xs',
                '.column': {
                  ...(rotateHeader && {
                    writingMode: 'vertical-lr',
                    transform: 'rotate(180deg)',
                    p: '9px 5px',
                    alignItems: 'flex-end',
                  }),
                },
              },
            }
          : {}),
        ...css,
      }}
    >
      {children}
    </Flex>
  );
};

export const GiveLeaderboardColumn = ({
  children,
  onClick,
  css,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  css?: CSS;
}) => {
  return (
    <Flex
      className="column"
      css={{
        flex: 2,
        padding: '8px',
        display: 'flex',
        color: '$text',
        alignItems: 'center',
        overflow: 'hidden',
        '@lg': {
          flex: 3,
        },
        '@sm': {
          flex: 6,
        },
        ...css,
      }}
      onClick={onClick}
    >
      {children}
    </Flex>
  );
};
