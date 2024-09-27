import assert from 'assert';
import { useContext, useState } from 'react';

import { isAddress } from 'ethers/lib/utils';
import { Mutes } from 'features/colinks/Mutes';
import { anonClient } from 'lib/anongql/anonClient';
import { useQuery } from 'react-query';

import { LoadingIndicator } from '../../../components/LoadingIndicator';
import { ActivityList } from '../../../features/activities/ActivityList';
import { CoLinksContext } from '../../../features/colinks/CoLinksContext';
import { useLinkingStatus } from '../../../features/colinks/useLinkingStatus';
import { QUERY_KEY_COLINKS } from '../../../features/colinks/wizard/CoLinksWizard';
import { client } from '../../../lib/gql/client';
import { Button, Flex, Panel, Text } from '../../../ui';
import { NotFound } from '../NotFound';
import useProfileId from 'hooks/useProfileId';
import { shortenAddressWithFrontLength } from 'utils';

import { AddPost } from './AddPost';

export const ProfilePagePostsContents = ({
  targetAddress,
}: {
  targetAddress: string;
}) => {
  const { address } = useContext(CoLinksContext);

  const profileId = useProfileId(false);

  if (!isAddress(targetAddress) && !targetAddress.endsWith('.eth')) {
    return <NotFound />;
  }

  return (
    <PageContents
      currentUserAddress={address}
      targetAddress={targetAddress}
      currentUserProfileId={profileId}
    />
  );
};

export const fetchCoLinksProfile = async (
  address: string,
  currentProfileId?: number
) => {
  const { profiles_public } = await anonClient.query(
    {
      profiles_public: [
        {
          where: {
            address: {
              _ilike: address,
            },
          },
        },
        {
          id: true,
          name: true,
          avatar: true,
          address: true,
          website: true,
          links: true,
          description: true,
          reputation_score: {
            total_score: true,
          },
        },
      ],
    },
    {
      operationName: 'fetch_coLinks_profile_anonClient',
    }
  );

  // Need to check mutes only if currentProfileId is set
  if (!currentProfileId) {
    assert(profiles_public.length == 1, 'profile not found');
    const p = profiles_public.pop();
    assert(p, 'profile not found');
    return {
      profile: p,
      mutedThem: false,
      imMuted: false,
    };
  }

  const { mutedThem, imMuted } = await client.query(
    {
      __alias: {
        mutedThem: {
          mutes: [
            {
              where: {
                target_profile: {
                  address: {
                    _ilike: address,
                  },
                },
                profile_id: {
                  _eq: currentProfileId,
                },
              },
            },
            {
              profile_id: true,
              target_profile_id: true,
            },
          ],
        },
        imMuted: {
          mutes: [
            {
              where: {
                profile: {
                  address: {
                    _eq: address,
                  },
                },
                target_profile_id: {
                  _eq: currentProfileId,
                },
              },
            },
            {
              profile_id: true,
              target_profile_id: true,
            },
          ],
        },
      },
    },
    {
      operationName: 'coLinks_profile_fetch_mutes',
    }
  );
  const profile = profiles_public.pop();
  const mutedThemI = mutedThem.pop();
  const imMutedI = imMuted.pop();

  assert(profile, "profile doesn't exist");
  return {
    profile,
    mutedThem: !!mutedThemI,
    imMuted: !!imMutedI,
  };
};

export type CoLinksProfile = Required<
  Awaited<ReturnType<typeof fetchCoLinksProfile>>
>;

const PageContents = ({
  currentUserAddress,
  currentUserProfileId,
  targetAddress,
}: {
  currentUserAddress?: string;
  currentUserProfileId?: number;
  targetAddress: string;
}) => {
  const [showLoading, setShowLoading] = useState(false);
  const { balance, targetBalance } = useLinkingStatus({
    address: currentUserAddress,
    target: targetAddress,
  });
  const targetIsCurrentUser =
    currentUserAddress &&
    targetAddress.toLowerCase() == currentUserAddress.toLowerCase();

  const [showCasts, setShowCasts] = useState<boolean>(true);

  const { data: targetProfile, isLoading: fetchCoLinksProfileIsLoading } =
    useQuery([QUERY_KEY_COLINKS, targetAddress, 'profile'], () =>
      fetchCoLinksProfile(targetAddress, currentUserProfileId)
    );

  const balanceNumber = Number(balance);
  const currentUserHasTargetCoLink =
    targetBalance !== undefined && balanceNumber > 0;

  if (!targetProfile?.profile && !fetchCoLinksProfileIsLoading) {
    return (
      <NotFound
        header={'No Profile Found'}
        backgroundImage={'/imgs/background/colink-no-profile.jpg'}
        imageCss={{ backgroundPosition: '50% 100%' }}
        gradientCss={{
          background:
            'radial-gradient(circle, #FA81B7 10%, #5D778F 68%, #2D3C49 83%, #C1D5E1 100%)',
        }}
      >
        <Flex column css={{ alignItems: 'flex-start' }}>
          <Text>It seems this address</Text>
          <Text
            tag
            color={'neutral'}
            css={{
              my: '$xs',
            }}
          >
            {shortenAddressWithFrontLength(targetAddress, 6)}{' '}
          </Text>
          <Text>does not have a profile on CoLinks yet.</Text>
        </Flex>
      </NotFound>
    );
  }

  if (!targetProfile?.profile) {
    return <LoadingIndicator />;
  }

  return (
    <Flex
      css={{
        gap: '$xl',
        width: '100%',
      }}
    >
      <Flex
        column
        css={{
          flexGrow: 1,
        }}
      >
        <Flex column css={{ gap: '$md' }}>
          <AddPost targetAddress={targetAddress} />
          {(targetIsCurrentUser || currentUserHasTargetCoLink) && (
            <Flex css={{ justifyContent: 'space-between' }}>
              <Flex css={{ gap: '$sm' }}>
                <Text semibold size="small">
                  View
                </Text>
                <Button
                  size="xs"
                  color={!showCasts ? 'secondary' : 'selectedSecondary'}
                  onClick={() => setShowCasts(true)}
                >
                  All
                </Button>
                <Button
                  size="xs"
                  color={showCasts ? 'secondary' : 'selectedSecondary'}
                  onClick={() => setShowCasts(false)}
                >
                  CoLinks Only
                </Button>
              </Flex>
              {!targetIsCurrentUser && (
                <Mutes
                  targetProfileId={targetProfile?.profile.id}
                  targetProfileAddress={targetAddress}
                />
              )}
            </Flex>
          )}
          <ActivityList
            queryKey={[
              QUERY_KEY_COLINKS,
              'activity',
              targetProfile.profile.id,
              showCasts,
            ]}
            pollForNewActivity={showLoading}
            onSettled={() => setShowLoading(false)}
            where={{
              _or: [
                {
                  big_question_id: { _is_null: false },
                },
                { private_stream: { _eq: true } },
                ...(showCasts ? [{ cast_id: { _is_null: false } }] : []),
              ],
              actor_profile_id: { _eq: targetProfile.profile.id },
            }}
            noPosts={(() => {
              let noPostsMessage;

              if (targetProfile.mutedThem) {
                noPostsMessage = `You have muted ${targetProfile.profile.name}. Unmute to see their posts.`;
              } else if (targetIsCurrentUser) {
                noPostsMessage = "You haven't posted yet.";
              } else {
                noPostsMessage = `${targetProfile.profile.name} hasn't posted yet.`;
              }

              return (
                <Panel noBorder css={{ alignItems: 'center' }}>
                  <Text>{noPostsMessage}</Text>
                </Panel>
              );
            })()}
          />
        </Flex>
      </Flex>
    </Flex>
  );
};
