import { useContext } from 'react';

import { useWindowSize } from '@react-hook/window-size';
import { ActivityList } from 'features/activities/ActivityList';
import { CoLinksContext } from 'features/colinks/CoLinksContext';
import { Poaps } from 'features/colinks/Poaps';
import { useLinkingStatus } from 'features/colinks/useLinkingStatus';
import { QUERY_KEY_COLINKS } from 'features/colinks/wizard/CoLinksWizard';
import { GiveReceived } from 'features/points/GiveReceived';
import { useQuery } from 'react-query';

import { LoadingIndicator } from 'components/LoadingIndicator';
import useProfileId from 'hooks/useProfileId';
import { GemCoOutline } from 'icons/__generated';
import { Flex, Panel, Text } from 'ui';

import { CoLinksProfile, fetchCoLinksProfile } from './ProfileHeader';
export const cardColumnMinWidth = 1280;

export const ProfileCards = ({ targetAddress }: { targetAddress: string }) => {
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
  const { address } = useContext(CoLinksContext);

  const profileId = useProfileId(false);
  if (!targetProfile) return <LoadingIndicator />;
  return (
    <ProfileCardsWithProfile
      targetProfile={targetProfile}
      targetAddress={targetAddress}
      currentUserAddress={address}
      currentUserProfileId={profileId}
    />
  );
};

export const ProfileCardsWithProfile = ({
  targetProfile,
  targetAddress,
  forceDisplay = false,
  currentUserAddress,
  currentUserProfileId,
}: {
  targetProfile: CoLinksProfile;
  targetAddress: string;
  forceDisplay?: boolean;
  currentUserAddress?: string;
  currentUserProfileId?: number;
}) => {
  const [width] = useWindowSize();
  const suppressCards = width < cardColumnMinWidth;

  const { profile } = targetProfile;
  const { balance, targetBalance } = useLinkingStatus({
    address: currentUserAddress,
    target: targetAddress,
  });
  const targetIsCurrentUser =
    currentUserAddress &&
    targetAddress.toLowerCase() == currentUserAddress.toLowerCase();
  const ownedByTarget = targetBalance !== undefined && targetBalance > 0;
  const ownedByMe = balance !== undefined && balance > 0;
  const weAreLinked = ownedByTarget || ownedByMe;

  if (suppressCards && !forceDisplay) return null;
  return (
    <Flex
      column
      css={{
        gap: '$sm',
      }}
    >
      <Panel noBorder>
        <Text>Last post {targetAddress}</Text>
      </Panel>
      <ActivityList
        queryKey={[QUERY_KEY_COLINKS, 'activity', targetProfile.profile.id]}
        pollForNewActivity={false}
        // onSettled={() => setShowLoading(false)}
        where={{
          _or: [
            {
              big_question_id: { _is_null: false },
            },
            { private_stream: { _eq: true } },
            {
              _and: [
                {
                  _or: [
                    { private_stream_visibility: {} },
                    {
                      actor_profile_id: {
                        _eq: currentUserProfileId,
                      },
                    },
                  ],
                },
                { cast_id: { _is_null: false } },
              ],
            },
          ],
          actor_profile_id: { _eq: targetProfile.profile.id },
        }}
        limit={1}
        noPosts={
          (targetProfile.mutedThem || targetIsCurrentUser || weAreLinked) && (
            <Panel noBorder>
              {targetProfile.mutedThem
                ? `You have muted ${targetProfile.profile.name}. Unmute to see their posts.`
                : (targetIsCurrentUser
                    ? "You haven't"
                    : `${targetProfile.profile.name} hasn't`) + ' posted yet.'}
            </Panel>
          )
        }
      />
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
