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
export const GiveReceived = ({
  address,
  size = 'small',
}: {
  address: string;
  size?: ComponentProps<typeof Text>['size'];
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
                  _eq: address,
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
    ['give_received', profileId],
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
                id: true,
                address: true,
                name: true,
                avatar: true,
              },
            },
          ],
        },
        {
          operationName: 'getGiveReceived',
        }
      );

      return colinks_gives;
    },
    {
      enabled: !!profileId,
    }
  );

  if (!data) return null;

  const sortedGives = groupAndSortGive(data);

  if (size === 'small' || size === 'xs' || size === 'medium') {
    return (
      <Text
        size={size}
        color={'secondary'}
        title={'GIVE Received'}
        css={{
          gap: size === 'xs' ? '$xs' : '$sm',
          whiteSpace: 'nowrap',
        }}
      >
        <GemCoOutline fa />
        <Text semibold>{data.length}</Text>
      </Text>
    );
  }

  if (size === 'large' || size === 'xl') {
    return (
      <>
        <Panel
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
                  <GemCoOutline fa size="xl" />
                  <Text semibold size="large" css={{ textAlign: 'center' }}>
                    {data.length}
                  </Text>
                </Flex>
                {/* <Text semibold size="xs" css={{ textAlign: 'center' }}>
                  GIVE <br />
                  Received
                </Text> */}
              </Flex>
            </Button>
          )}
          <Flex
            css={{
              gap: '$sm',
              flexWrap: 'wrap',
              m: size == 'xl' ? '$sm' : 0,
              alignItems: 'flex-start',
            }}
          >
            {sortedGives.map((g, i) => (
              <Flex key={`give_${g.skill}_${i}`}>
                <Popover>
                  <PopoverTrigger
                    css={{
                      cursor: 'pointer',
                      opacity: 0.7,
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
                        to={coLinksPaths.giveBoardSkill(g.skill)}
                        css={{
                          fontSize: '$xs',
                          color: '$complete',
                        }}
                      >
                        View GIVE Leaderboard
                      </AppLink>
                    </Flex>
                    <Flex column css={{ gap: '$sm' }}>
                      {g.gives
                        .filter(give => give.giver_profile_public?.name)
                        .map(
                          (give, index) =>
                            give.giver_profile_public && (
                              <Flex
                                key={give.giver_profile_public.address}
                                css={{ alignItems: 'center', gap: '$sm' }}
                              >
                                <ActivityAvatar
                                  size="xs"
                                  profile={give.giver_profile_public}
                                />
                                <Text
                                  size="small"
                                  semibold
                                  css={{ textDecoration: 'none' }}
                                  as={NavLink}
                                  to={coLinksPaths.profile(
                                    give.giver_profile_public.address || ''
                                  )}
                                  key={index}
                                >
                                  {give.giver_profile_public?.name}
                                </Text>
                              </Flex>
                            )
                        )}
                    </Flex>
                  </PopoverContent>
                </Popover>
              </Flex>
            ))}
          </Flex>
        </Panel>
      </>
    );
  }
};
