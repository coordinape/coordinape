import { useWindowSize } from '@react-hook/window-size';
import { ActivityRow } from 'features/activities/ActivityRow';
import {
  activitySelector,
  anon_activitySelector,
} from 'features/activities/useInfiniteActivities';
import { Poaps } from 'features/colinks/Poaps';
import { QUERY_KEY_COLINKS } from 'features/colinks/wizard/CoLinksWizard';
import { CoSoulArt } from 'features/cosoul/art/CoSoulArt';
import { GiveReceived } from 'features/points/GiveReceived';
import { order_by as anon_order_by } from 'lib/anongql/__generated__/zeus';
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

import { LinkUpCard } from './LinkUpCard';
import { CoLinksProfile, fetchCoLinksProfile } from './ProfileHeader';

export const cardColumnMinWidth = 1280;
export const cardMaxWidth = 343;
export const cardMinHeight = 80;
export const QUERY_KEY_NETWORK = 'network';
export const POST_PAGE_LATEST_CAST_STATS = 'colinks_post_page_cast_stats';

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

  const { data: anon_data } = useQuery(
    [POST_PAGE_LATEST_CAST_STATS, profileId],
    () => fetchMostRecentCastAndActivitiesByProfileId(Number(profileId))
  );

  const { mostRecentActivity } = data || {};

  const { totalActivitiesCount, mostRecentCast } = anon_data || {};

  const panelStyles = {
    height: 'fit-content',
    minHeight: cardMinHeight,
    width: '100%',
    maxWidth: cardMaxWidth,
    color: '$text',
    justifyContent: 'center',
    '@sm': {
      flexGrow: 1,
    },
  };

  if (suppressCards && !forceDisplay) return null;
  return (
    <Flex
      column
      css={{
        gap: '$sm',
        flexShrink: 1,
        maxWidth: cardMaxWidth,
        margin: '0 auto',
        '@sm': {
          maxWidth: 700,
          margin: '0 auto',
          display: 'grid',
          gridAutoFlow: 'dense',
          gridTemplateColumns: 'minmax(200px, 1fr) minmax(200px, 1fr)',
          gridGap: '$md',
        },
        '@xs': {
          display: 'flex',
          maxWidth: cardMaxWidth,
          margin: '0 auto',
          flexDirection: 'column',
        },
      }}
    >
      {/* Card Post */}
      {!location.pathname.includes('posts') && (
        <Flex
          column
          css={{
            flexShrink: 1,
            gap: '$sm',
            width: 'auto',
            '@sm': {
              gridColumn: '1 / 3',
            },
            '@xs': {
              gridColumn: 'auto',
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
            <Flex
              column
              css={{
                borderRadius: '$3',
                gap: '$xs',
              }}
            >
              <ActivityRow
                timestampVerb
                key={mostRecentActivity.id}
                activity={mostRecentActivity}
              />
            </Flex>
          )}
        </Flex>
      )}
      {/* Card Cast */}
      {!location.pathname.includes('posts') && (
        <Flex
          column
          css={{
            flexShrink: 1,
            gap: '$sm',
            width: 'auto',
            '@sm': {
              gridColumn: '1 / 3',
            },
            '@xs': {
              gridColumn: 'auto',
            },
            '.postAvatar': {
              display: 'none',
            },
            '.postContent': {
              ml: 0,
            },
          }}
        >
          {mostRecentCast && (
            <Flex
              column
              css={{
                borderRadius: '$3',
                gap: '$xs',
              }}
            >
              <ActivityRow
                timestampVerb
                key={mostRecentCast.id}
                activity={mostRecentCast}
              />
            </Flex>
          )}
        </Flex>
      )}
      {/* Card Give */}
      <Panel
        as={AppLink}
        to={coLinksPaths.profileGive(targetAddress)}
        noBorder
        css={{
          ...panelStyles,
          '@sm': {
            color: 'white',
            background:
              'radial-gradient(circle at -10% 10%, $profileCardGiveGradientStart 20%, $profileCardGiveGradientEnd 100%)',
          },
        }}
      >
        <Flex css={{ gap: '$md', alignItems: 'center' }}>
          <GemCoOutline fa size="2xl" />
          <Flex column>
            <Text css={{ gap: '$xs' }}>
              <Text semibold>
                <GiveReceived address={targetAddress}>
                  {receivedNumber => receivedNumber}
                </GiveReceived>
              </Text>
              GIVE Received
            </Text>
            <Text css={{ gap: '$xs' }}>
              <Text semibold>
                <GiveReceived address={targetAddress}>
                  {(_, sentNumber) => sentNumber}
                </GiveReceived>
              </Text>
              GIVE Sent
            </Text>
          </Flex>
        </Flex>
      </Panel>
      {/* Card Rep */}
      <Flex
        as={AppLink}
        to={coLinksPaths.profileReputation(targetAddress)}
        css={{
          width: cardMaxWidth,
          height: cardMinHeight,
          borderRadius: '$3',
          overflow: 'hidden',
          alignItems: 'center',
          position: 'relative',
          canvas: {
            ml: -100,
            scale: 0.9,
            '@sm': {
              ml: 0,
              scale: 1.3,
            },
          },
          '@sm': {
            width: '100%',
            maxWidth: 'none',
          },
          '@xs': {
            width: cardMaxWidth,
            maxWidth: 'none',
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
      {/* Card Farcaster */}
      <Panel
        as={AppLink}
        to={coLinksPaths.profileNetwork(targetAddress)}
        noBorder
        css={{
          ...panelStyles,
          '@sm': {
            color: 'white',
            background:
              'radial-gradient(circle at -10% 10%, $profileCardFarcasterGradientStart 20%, $profileCardFarcasterGradientEnd 100%)',
          },
        }}
      >
        <Flex css={{ gap: '$md', alignItems: 'center' }}>
          <Farcaster fa size="2xl" />
          <Flex column>
            <Text css={{ gap: '$xs' }}>
              <Text semibold>{network?.tier_counts[4] || 0}</Text>
              Following in FC
            </Text>
            <Text css={{ gap: '$xs' }}>
              <Text semibold>{network?.tier_counts[5] || 0}</Text>
              Followers in FC
            </Text>
            <Text css={{ gap: '$xs' }}>
              <Text semibold>{network?.tier_counts[3] || 0}</Text>
              Mutuals
            </Text>
          </Flex>
        </Flex>
      </Panel>
      {/* Card CoLinks */}
      <Panel
        as={AppLink}
        to={coLinksPaths.profileNetwork(targetAddress)}
        noBorder
        css={{
          ...panelStyles,
          '@sm': {
            gridColumn: '1 / 3',
            color: 'white',
            background:
              'radial-gradient(circle at -10% 10%, $profileCardCoLinksGradientStart 20%, $profileCardCoLinksGradientEnd 100%)',
          },
        }}
      >
        <Flex css={{ gap: '$md', alignItems: 'flex-start' }}>
          <Links fa size="2xl" css={{ minWidth: '$2xl' }} />
          <Flex column css={{ flexGrow: 1 }}>
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
                <Text semibold>{totalActivitiesCount ?? 0}</Text>
                Posts
              </Text>
            </Flex>
            <Flex
              column
              css={{
                borderTop: '0.5px solid $borderDim',
                mt: '$sm',
                width: '100%',
              }}
            >
              <LinkUpCard targetAddress={targetAddress} profileCardContext />
            </Flex>
          </Flex>
        </Flex>
      </Panel>
      {/* Card Poaps */}
      <Flex
        css={{
          width: '100%',
          maxWidth: cardMaxWidth,
        }}
      >
        <Poaps address={targetAddress} profileCard />
      </Flex>
    </Flex>
  );
};

const fetchMostRecentPostByProfileId = async (profileId: number) => {
  const { coLinksPosts } = await client.query(
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
      },
    },
    {
      operationName: 'fetchMostRecentPostByProfileId',
    }
  );

  const mostRecentActivity = coLinksPosts[0]; // Return the most recent post

  return { mostRecentActivity };
};

const fetchMostRecentCastAndActivitiesByProfileId = async (
  profileId: number
) => {
  const { farcasterCasts, activities_aggregate } = await anonClient.query(
    {
      __alias: {
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
                  created_at: anon_order_by.desc,
                },
              ],
              limit: 1,
            },
            anon_activitySelector,
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
      operationName: 'fetchMostRecentCastAndActivityStatsByProfileId',
    }
  );

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

  return { mostRecentCast, totalActivitiesCount };
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
