import { useWindowSize } from '@react-hook/window-size';
import { ActivityRow } from 'features/activities/ActivityRow';
import { activitySelector } from 'features/activities/useInfiniteActivities';
import { Poaps } from 'features/colinks/Poaps';
import { QUERY_KEY_COLINKS } from 'features/colinks/wizard/CoLinksWizard';
import { CoSoulArt } from 'features/cosoul/art/CoSoulArt';
import { GiveReceived } from 'features/points/GiveReceived';
import { anonClient } from 'lib/anongql/anonClient';
import { order_by } from 'lib/gql/__generated__/zeus';
import { client } from 'lib/gql/client';
import { useQuery } from 'react-query';

import { fetchCasts } from '../../../features/activities/cast';
import { LoadingIndicator } from 'components/LoadingIndicator';
import useProfileId from 'hooks/useProfileId';
import { Farcaster, GemCoOutline, Links } from 'icons/__generated';
import { POST_PAGE_QUERY_KEY } from 'pages/PostPage';
import { coLinksPaths } from 'routes/paths';
import { AppLink, Flex, Panel, Text } from 'ui';

import { CoLinksProfile, fetchCoLinksProfile } from './ProfileHeader';

export const cardColumnMinWidth = 1280;
export const QUERY_KEY_NETWORK = 'network';

export const ProfileCards = ({
  targetAddress,
  forceDisplay,
}: {
  targetAddress: string;
  forceDisplay?: boolean;
}) => {
  const currentUserProfileId = useProfileId(false);
  const { data: targetProfile } = useQuery(
    [QUERY_KEY_COLINKS, targetAddress, 'profile'],
    () => {
      if (!targetAddress) return;
      return fetchCoLinksProfile(targetAddress, currentUserProfileId);
    },
    {
      enabled: !!targetAddress,
    }
  );
  if (!targetProfile) return <LoadingIndicator />;
  return (
    <ProfileCardsWithProfile
      forceDisplay={forceDisplay}
      targetProfile={targetProfile}
      targetAddress={targetAddress}
    />
  );
};

export const ProfileCardsWithProfile = ({
  targetProfile,
  targetAddress,
  forceDisplay = false,
}: {
  targetProfile: CoLinksProfile;
  targetAddress: string;
  forceDisplay?: boolean;
}) => {
  const [width] = useWindowSize();
  const suppressCards = width < cardColumnMinWidth;

  const { profile } = targetProfile;
  const profileId = targetProfile.profile.id;

  const { data: networkData } = useQuery(
    [QUERY_KEY_NETWORK, targetAddress, 'profile'],
    async () => await fetchNetworkNodes(targetAddress!),
    { enabled: !!targetAddress }
  );

  const network:
    | {
        nodes: any[];
        tier_counts: { 1: number; 2: number; 3: number; 4: number; 5: number };
      }
    | undefined = networkData?.network;

  const { data } = useQuery([POST_PAGE_QUERY_KEY, profileId], () =>
    fetchMostRecentPostByProfileId(Number(profileId))
  );

  const { mostRecentActivity, totalActivitiesCount, mostRecentCast } =
    data || {};

  const cardMaxWidth = 350;

  const panelStyles = {
    minHeight: 90,
    maxWidth: cardMaxWidth,
    pr: '$lg',
    flexGrow: 1,
  };

  if (suppressCards && !forceDisplay) return null;
  return (
    <Flex
      column
      css={{
        gap: '$sm',
        flexShrink: 1,
        maxWidth: cardMaxWidth,
        '@sm': {
          maxWidth: '100%',
        },
      }}
    >
      {!location.pathname.includes('posts') && (
        <Flex
          column
          css={{
            flexShrink: 1,
            width: 'auto',
            '.contributionRow': {
              // flexGrow: 1,
            },
            '.postAvatar': {
              display: 'none',
            },
            '.postContent': {
              ml: 0,
            },
          }}
        >
          {mostRecentActivity && (
            <ActivityRow
              key={mostRecentActivity.id}
              activity={mostRecentActivity}
            />
          )}
          {mostRecentCast && (
            <ActivityRow key={mostRecentCast.id} activity={mostRecentCast} />
          )}
        </Flex>
      )}
      <Flex
        css={{
          gap: '$sm',
          flexDirection: 'column',
          '@sm': {
            flexDirection: 'row',
            flexWrap: 'wrap',
          },
        }}
      >
        <Panel
          as={AppLink}
          to={coLinksPaths.profileNetwork(targetAddress)}
          noBorder
          css={{
            ...panelStyles,
            color: 'white',
            background:
              'radial-gradient(circle at -10% 10%, $farcaster 20%, #9572eb 100%)',
          }}
        >
          <Flex css={{ gap: '$md', alignItems: 'center' }}>
            <Farcaster fa size="2xl" />
            <Flex column>
              <Text css={{ gap: '$xs' }}>
                <Text semibold>{network?.tier_counts[3] || 0}</Text>
                Mutually linked in FC
              </Text>
              <Text css={{ gap: '$xs' }}>
                <Text semibold>{network?.tier_counts[4] || 0}</Text>
                Following in FC
              </Text>
              <Text css={{ gap: '$xs' }}>
                <Text semibold>{network?.tier_counts[5] || 0}</Text>
                Followers in FC
              </Text>
            </Flex>
          </Flex>
        </Panel>
        <Panel
          as={AppLink}
          to={coLinksPaths.profileNetwork(targetAddress)}
          noBorder
          css={{
            ...panelStyles,
            color: 'white',
            background:
              'radial-gradient(circle at -10% 10%, rgb(55 81 208) 20%, rgb(231, 7, 144) 100%)',
          }}
        >
          <Flex css={{ gap: '$md', alignItems: 'center' }}>
            <Links fa size="2xl" />
            <Flex column>
              <Text css={{ gap: '$xs' }}>
                <Text semibold>{profile.links ?? 0}</Text>
                CoLinks
              </Text>
              <Text css={{ gap: '$xs' }}>
                <Text semibold>
                  <LinkHoldings holder={targetAddress} />
                </Text>
                CoLinks Held
              </Text>
              <Text css={{ gap: '$xs' }}>
                <Text semibold>{totalActivitiesCount}</Text>
                Posts
              </Text>
            </Flex>
          </Flex>
        </Panel>
        <Panel
          as={AppLink}
          to={coLinksPaths.profileGive(targetAddress)}
          noBorder
          css={{
            ...panelStyles,
            color: 'white',
            background:
              'radial-gradient(circle at -10% 10%, #0ecf87 20%, #5528d6 100%)',
          }}
        >
          <Flex css={{ gap: '$md', alignItems: 'center' }}>
            <GemCoOutline fa size="2xl" />
            <Flex column>
              <Text css={{ gap: '$xs' }}>
                <Text semibold>
                  <GiveReceived address={targetAddress} receivedNumber />
                </Text>
                GIVE Received
              </Text>
              <Text css={{ gap: '$xs' }}>
                <Text semibold>
                  <GiveReceived address={targetAddress} sentNumber />
                </Text>
                GIVE Sent
              </Text>
              <Text css={{ gap: '$xs' }}>
                <Text semibold>{network?.tier_counts[1]}</Text>
                GIVE Connections
              </Text>
            </Flex>
          </Flex>
        </Panel>
        <Flex
          as={AppLink}
          to={coLinksPaths.profileReputation(targetAddress)}
          css={{
            width: cardMaxWidth,
            height: 90,
            borderRadius: '$3',
            overflow: 'hidden',
            alignItems: 'center',
            position: 'relative',
            canvas: {
              ml: -100,
              scale: 0.6,
            },
          }}
        >
          <CoSoulArt
            repScore={profile.reputation_score?.total_score ?? 0}
            address={targetAddress}
            animate={false}
          />
          <Flex
            column
            css={{
              position: 'absolute',
              left: '$md',
              zIndex: 1,
            }}
          >
            <Text h1 css={{ color: 'white' }}>
              {profile.reputation_score?.total_score ?? 0}
            </Text>
            <Text semibold css={{ color: 'white' }}>
              Reputation Score
            </Text>
          </Flex>
        </Flex>
        <Flex css={{ width: '100%', maxWidth: cardMaxWidth }}>
          <Poaps address={targetAddress} profileCard />
        </Flex>
      </Flex>
    </Flex>
  );
};

const fetchMostRecentPostByProfileId = async (profileId: number) => {
  // TODO: switch this to anonClient, maybe other places too
  const { coLinksPosts, farcasterCasts, activities_aggregate } =
    await client.query(
      {
        __alias: {
          coLinksPosts: {
            activities: [
              {
                where: {
                  actor_profile_id: {
                    _eq: profileId,
                  },
                  _or: [
                    {
                      private_stream: {
                        _eq: true,
                      },
                    },
                    {
                      big_question_id: {
                        _is_null: false,
                      },
                    },
                  ],
                },
                order_by: [
                  {
                    created_at: order_by.desc,
                  },
                ],
                limit: 1,
              },
              activitySelector,
            ],
          },
          farcasterCasts: {
            activities: [
              {
                where: {
                  actor_profile_id: {
                    _eq: profileId,
                  },
                  cast_id: {
                    _is_null: false,
                  },
                  enriched_cast: {},
                },
                order_by: [
                  {
                    created_at: order_by.desc,
                  },
                ],
                limit: 1,
              },
              activitySelector,
            ],
          },
        },
        activities_aggregate: [
          {
            where: {
              actor_profile_id: {
                _eq: profileId,
              },
              _or: [
                {
                  private_stream: {
                    _eq: true,
                  },
                },
                {
                  big_question_id: {
                    _is_null: false,
                  },
                },
              ],
            },
          },
          {
            aggregate: {
              count: [{}, true],
            },
          },
        ],
      },
      {
        operationName: 'fetchMostRecentPostByProfileId',
      }
    );

  const mostRecentActivity = coLinksPosts[0]; // Return the most recent post

  const rawCast = farcasterCasts[0];
  let actualCast: Awaited<ReturnType<typeof fetchCasts>>[number] | undefined =
    undefined;

  if (rawCast) {
    const c = await fetchCasts([rawCast.cast_id]);
    actualCast = c[0];
  }
  const mostRecentCast = actualCast
    ? { ...rawCast, cast: actualCast }
    : undefined; // Return the most recent cast
  const totalActivitiesCount = activities_aggregate.aggregate?.count ?? 0;

  return { mostRecentActivity, mostRecentCast, totalActivitiesCount };
};

const LinkHoldings = ({ holder }: { holder: string }) => {
  const {
    data: heldCount,
    isLoading,
    error,
  } = useQuery([QUERY_KEY_COLINKS, holder, 'heldCount'], async () => {
    const { link_holders_aggregate } = await anonClient.query(
      {
        link_holders_aggregate: [
          {
            where: {
              holder: {
                _eq: holder,
              },
              amount: {
                _gt: 0,
              },
            },
          },
          {
            aggregate: {
              sum: {
                amount: true,
              },
            },
          },
        ],
      },
      {
        operationName: 'coLinks_held_count',
      }
    );
    return link_holders_aggregate.aggregate?.sum?.amount ?? 0;
  });

  if (isLoading) {
    return <>Loading...</>;
  }

  if (error) {
    return <>?</>;
  }

  return <>{heldCount}</>;
};

const fetchNetworkNodes = async (address: string) => {
  const res = await fetch(`/api/network/${address}`);
  const data = await res.json();
  return data;
};
