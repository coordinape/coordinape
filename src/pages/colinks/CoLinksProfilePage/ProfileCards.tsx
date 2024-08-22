/* eslint-disable @typescript-eslint/no-unused-vars */
import { useContext } from 'react';

import { useWindowSize } from '@react-hook/window-size';
import { ActivityRow } from 'features/activities/ActivityRow';
import { activitySelector } from 'features/activities/useInfiniteActivities';
import { CoLinksContext } from 'features/colinks/CoLinksContext';
import { Poaps } from 'features/colinks/Poaps';
import { QUERY_KEY_COLINKS } from 'features/colinks/wizard/CoLinksWizard';
import { GiveReceived } from 'features/points/GiveReceived';
import { order_by } from 'lib/gql/__generated__/zeus';
import { client } from 'lib/gql/client';
import { useQuery } from 'react-query';

import { LoadingIndicator } from 'components/LoadingIndicator';
import useProfileId from 'hooks/useProfileId';
import { GemCoOutline } from 'icons/__generated';
import { POST_PAGE_QUERY_KEY } from 'pages/PostPage';
import { Flex, Panel, Text } from 'ui';

import { CoLinksProfile, fetchCoLinksProfile } from './ProfileHeader';
export const cardColumnMinWidth = 1280;

export const ProfileCards = ({
  targetAddress,
  forceDisplay,
}: {
  targetAddress: string;
  forceDisplay: boolean;
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

  const { data: post } = useQuery([POST_PAGE_QUERY_KEY, profileId], () =>
    fetchMostRecentPostByProfileId(Number(profileId))
  );

  if (suppressCards && !forceDisplay) return null;
  return (
    <Flex
      column
      css={{
        gap: '$sm',
        flexGrow: 1,
      }}
    >
      {!location.pathname.includes('posts') && (
        <Flex
          column
          css={{
            '.postAvatar': {
              display: 'none',
            },
            '.postContent': {
              ml: 0,
            },
          }}
        >
          {post && <ActivityRow key={post.id} activity={post} />}
        </Flex>
      )}
      <Panel noBorder>
        <Text>colinks stats</Text>
        <Text>links: {profile.links ?? 0}</Text>
        <Text>holding</Text>
      </Panel>
      <Panel noBorder>network stats</Panel>
      <Panel noBorder>
        <GemCoOutline fa />
        received: <GiveReceived address={targetAddress} receivedNumber />
        sent: <GiveReceived address={targetAddress} sentNumber />
      </Panel>
      <Panel noBorder>
        Rep overview {profile.reputation_score?.total_score ?? 0}
      </Panel>
      <Poaps address={targetAddress} />
    </Flex>
  );
};

const fetchMostRecentPostByProfileId = async (profileId: number) => {
  const { activities } = await client.query(
    {
      activities: [
        {
          where: {
            actor_profile_public: {
              id: {
                _eq: profileId,
              },
            },
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
    {
      operationName: 'fetchMostRecentPostByProfileId',
    }
  );

  return activities[0]; // Return the most recent activity
};
