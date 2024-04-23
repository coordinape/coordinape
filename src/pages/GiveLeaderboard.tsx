import { useEffect, useState } from 'react';

import { useQuery } from 'react-query';

import { order_by } from '../lib/anongql/__generated__/zeus';
import { anonClient } from '../lib/anongql/anonClient';
import { skillTextStyle } from '../stitches.config';
import { GemCoOutline } from 'icons/__generated';
import { Flex, Text } from 'ui';

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
      <Flex
        key={sort}
        column
        css={{
          height: '100vh',
          width: '100%',
          background:
            'radial-gradient(circle at 25% 0%, #5507E7 20%, #E7A607 100%)',
          alignItems: 'center',
          position: 'fixed',
          overflow: 'scroll',
          paddingBottom: 100,
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
          }}
        >
          <Flex column css={{ alignItems: 'center', paddingTop: '100px' }}>
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
              backgroundColor: '#464d5533',
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
              <Row header={true}>
                <Column onClick={() => setSort('rank')}>Rank</Column>
                <Column onClick={() => setSort('skill')}>Skill</Column>
                <Column onClick={() => setSort('gives')}>Total GIVEs</Column>
                <Column onClick={() => setSort('gives_last_24_hours')}>
                  Last 24 Hrs
                </Column>
                <Column onClick={() => setSort('gives_last_7_days')}>
                  Last 7 Days
                </Column>
                <Column onClick={() => setSort('gives_last_30_days')}>
                  Last 30 Days
                </Column>
              </Row>
              {sortedData &&
                sortedData.map(skill => (
                  <Row key={skill.skill}>
                    <Column>#{skill.rank}</Column>
                    <Column>
                      <Text
                        tag
                        size="small"
                        color="complete"
                        css={{ gap: '$xs' }}
                      >
                        {/*<GemCoOutline fa size={'md'} css={{ color: '$text' }} />*/}
                        <Text css={{ color: '$text', ...skillTextStyle }}>
                          {skill.skill}
                        </Text>
                      </Text>
                    </Column>
                    <Column>{skill.gives}</Column>
                    <Column>{skill.gives_last_24_hours}</Column>
                    <Column>{skill.gives_last_7_days}</Column>
                    <Column>{skill.gives_last_30_days}</Column>
                  </Row>
                ))}
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </>
  );
};

const Row = ({
  children,
  header,
}: {
  children: React.ReactNode;
  header?: boolean;
}) => {
  return (
    <Flex
      css={{
        width: '100%',
        flexFlow: 'row nowrap',
        alignItems: 'stretch',
        borderBottom: 'solid 1px #727272',
        fontWeight: '300',
        ...(header
          ? {
              border: 'none',
              position: 'sticky',
              cursor: 'pointer',
              top: 0,
              fontWeight: '700',
              backgroundColor: '#343a4099',
              minHeight: '50px',
            }
          : {}),
      }}
    >
      {children}
    </Flex>
  );
};

const Column = ({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) => {
  return (
    <Flex
      css={{
        flex: 2,
        padding: '10px',
        wordBreak: 'break-all',
        display: 'flex',
        color: 'white',
        alignItems: 'center',
        '@sm': {
          flex: 1,
        },
        '@lg': {
          flex: 3,
        },
      }}
      onClick={onClick}
    >
      {children}
    </Flex>
  );
};
