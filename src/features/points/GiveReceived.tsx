import { ComponentProps } from 'react';

import { ActivityAvatar } from 'features/activities/ActivityAvatar';
import { anonClient } from 'lib/anongql/anonClient';
import { useQuery } from 'react-query';
import { NavLink } from 'react-router-dom';
import { skillTextStyle } from 'stitches.config';

import {
  AppLink,
  Button,
  Flex,
  Panel,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Text,
} from '../../ui';
import { GemCoOutline } from 'icons/__generated';
import { coLinksPaths } from 'routes/paths';

import { groupAndSortGive } from './PostGives';

export const GIVE_RECEIVED_QUERY_KEY = 'Colnks_give_received';

export const GiveReceived = ({
  address,
  size = 'small',
  children,
}: {
  address: string;
  size?: ComponentProps<typeof Text>['size'];
  children?: (receivedNumber: number, sentNumber: number) => React.ReactNode;
}) => {
  const { data: profileId } = useQuery(
    ['give_received_lookup_profile_id', address],
    async () => {
      const { profiles_public } = await anonClient.query(
        {
          profiles_public: [
            {
              where: {
                address: {
                  _ilike: address,
                },
              },
              limit: 1,
            },
            {
              id: true,
            },
          ],
        },
        {
          operationName: 'getGiveReceivedLookupProfileId',
        }
      );
      const profile_id: number = profiles_public.pop()?.id;
      return profile_id;
    }
  );

  const { data } = useQuery(
    [GIVE_RECEIVED_QUERY_KEY, profileId, 'give_received'],
    async () => {
      const { colinks_gives, numGiveSent } = await anonClient.query(
        {
          __alias: {
            colinks_gives: {
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
                    id: true,
                    address: true,
                    name: true,
                    avatar: true,
                  },
                },
              ],
            },
            numGiveSent: {
              colinks_gives_aggregate: [
                {
                  where: {
                    profile_id: {
                      _eq: profileId,
                    },
                  },
                },
                { aggregate: { count: [{}, true] } },
              ],
            },
          },
        },
        {
          operationName: 'getGiveReceivedAndSent',
        }
      );

      return {
        colinks_gives,
        numGiveSent: numGiveSent.aggregate?.count ?? 0,
      };
    },
    {
      enabled: !!profileId,
    }
  );

  if (!data) return null;

  const { colinks_gives, numGiveSent } = data;
  const sortedGives = groupAndSortGive(colinks_gives);

  if (children) {
    return <>{children(colinks_gives.length, numGiveSent)}</>;
  }

  if (size === 'small' || size === 'xs') {
    return (
      <Text
        size={size}
        color={'secondary'}
        title={'GIVE Received'}
        css={{
          gap: '$xs',
          whiteSpace: 'nowrap',
        }}
      >
        <Text semibold>{colinks_gives.length}</Text>
        <GemCoOutline fa />
        {size !== ('xs' || 'small') && <Text>GIVE Received</Text>}
      </Text>
    );
  }

  if (size === 'medium') {
    return (
      <>
        <Text
          size={size}
          color={'secondary'}
          title={'GIVE Received'}
          css={{
            gap: '$xs',
            whiteSpace: 'nowrap',
          }}
        >
          <Text semibold>{colinks_gives.length}</Text>
          <GemCoOutline fa />
          <Text>GIVE Received</Text>
        </Text>
        <Text
          size="medium"
          color={'secondary'}
          title={'GIVE Received'}
          css={{
            gap: '$xs',
            whiteSpace: 'nowrap',
          }}
        >
          <Text semibold>{numGiveSent}</Text>
          <GemCoOutline fa />
          <Text>GIVE Sent </Text>
        </Text>
      </>
    );
  }

  if (size === 'large' || size === 'xl') {
    return (
      <>
        <Panel
          className="giveSkillWrapper"
          css={{
            flexDirection: 'row',
            p: 0,
            border: 'none',
            overflow: 'clip',
            background: size == 'xl' ? '$surface' : 'transparent',
          }}
        >
          {size == 'xl' && (
            <Button
              className="clickProtect"
              as="span"
              noPadding
              color="cta"
              css={{
                pointerEvents: 'none',
                cursor: 'default',
                p: '$md',
                borderRadius: 0,
                background: 'linear-gradient(.33turn, $cta 23%, $complete)',
              }}
            >
              <Flex column css={{ alignItems: 'center', gap: '$sm' }}>
                <Flex row css={{ alignItems: 'center', gap: '$xs' }}>
                  <Text semibold size="large" css={{ textAlign: 'center' }}>
                    {colinks_gives.length}
                  </Text>
                  <GemCoOutline fa size="xl" />
                </Flex>
              </Flex>
            </Button>
          )}
          <Flex
            className="giveSkillContainer"
            css={{
              gap: '$sm',
              flexWrap: 'wrap',
              m: size == 'xl' ? '$sm' : 0,
              alignItems: 'flex-start',
            }}
          >
            {sortedGives.map((g, i) => {
              const seenNames = new Map<
                string,
                { count: number; profile: any }
              >();

              g.gives.forEach(give => {
                const name = give.giver_profile_public?.name;
                if (name) {
                  const entry = seenNames.get(name);
                  if (!entry) {
                    seenNames.set(name, {
                      count: 1,
                      profile: give.giver_profile_public,
                    });
                  } else {
                    entry.count += 1;
                  }
                }
              });

              return (
                <Flex key={`give_${g.skill}_${i}`}>
                  <Popover>
                    <PopoverTrigger
                      css={{
                        cursor: 'pointer',
                        opacity: 0.9,
                        '&:hover': { opacity: 1 },
                      }}
                    >
                      <Text
                        tag
                        size="small"
                        color="complete"
                        css={{ gap: '$xs' }}
                      >
                        {g.skill ? (
                          <>
                            {' '}
                            <Text
                              size="small"
                              css={{ fontWeight: 'normal' }}
                            >{`+${g.count}`}</Text>
                            <GemCoOutline fa size={'md'} />
                            <Text css={skillTextStyle}>{g.skill}</Text>
                          </>
                        ) : (
                          <>
                            <Text
                              size="small"
                              css={{ fontWeight: 'normal' }}
                            >{`+${g.count}`}</Text>
                            <GemCoOutline fa size={'md'} />
                          </>
                        )}
                      </Text>
                    </PopoverTrigger>
                    <PopoverContent
                      align="end"
                      css={{
                        background: '$dim',
                        mt: '$sm',
                        p: '$sm $sm',
                      }}
                    >
                      <Flex
                        column
                        css={{
                          borderBottom: '0.5px solid $border',
                          pb: '$xs',
                          mb: '$sm',
                          gap: '$xs',
                        }}
                      >
                        <AppLink
                          to={coLinksPaths.exploreSkill(g.skill)}
                          css={{
                            fontSize: '$small',
                            color: '$complete',
                            fontWeight: '$semibold',
                          }}
                        >
                          {g.skill}
                        </AppLink>
                        <AppLink
                          to={coLinksPaths.giveSkill(g.skill)}
                          css={{
                            fontSize: '$xs',
                            color: '$complete',
                          }}
                        >
                          View GIVE Leaderboard
                        </AppLink>
                      </Flex>
                      <Flex column css={{ gap: '$sm' }}>
                        {Array.from(seenNames.entries()).map(
                          ([name, { count, profile }]) => (
                            <Flex
                              key={profile.address}
                              css={{ alignItems: 'center', gap: '$sm' }}
                            >
                              <>
                                <ActivityAvatar size="xs" profile={profile} />
                                <Text
                                  size="small"
                                  semibold
                                  css={{ textDecoration: 'none' }}
                                  as={NavLink}
                                  to={coLinksPaths.profileGive(
                                    profile.address || ''
                                  )}
                                >
                                  {name}
                                  <Text css={{ ml: '$xs' }}>
                                    &times;{count}
                                  </Text>
                                </Text>
                              </>
                            </Flex>
                          )
                        )}
                      </Flex>
                    </PopoverContent>
                  </Popover>
                </Flex>
              );
            })}
          </Flex>
        </Panel>
      </>
    );
  }
};
