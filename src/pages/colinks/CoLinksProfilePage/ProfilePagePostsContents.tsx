import assert from 'assert';
import React, { useContext, useEffect, useState } from 'react';

import { isAddress } from 'ethers/lib/utils';
import { colinksProfileColumnWidth } from 'features/cosoul/constants';
import { anonClient } from 'lib/anongql/anonClient';
import { useQuery } from 'react-query';

import { LoadingIndicator } from '../../../components/LoadingIndicator';
import { ActivityList } from '../../../features/activities/ActivityList';
import { BuyOrSellCoLinks } from '../../../features/colinks/BuyOrSellCoLinks';
import { CoLinksContext } from '../../../features/colinks/CoLinksContext';
import { fetchCoSoul } from '../../../features/colinks/fetchCoSouls';
import { useLinkingStatus } from '../../../features/colinks/useLinkingStatus';
import { QUERY_KEY_COLINKS } from '../../../features/colinks/wizard/CoLinksWizard';
import { client } from '../../../lib/gql/client';
import { Button, Flex, Link, Panel, Text } from '../../../ui';
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

  const [needsToBuyLink, setNeedsToBuyLink] = useState<boolean | undefined>(
    undefined
  );
  const [showCasts, setShowCasts] = useState<boolean>(true);

  const { data: targetProfile, isLoading: fetchCoLinksProfileIsLoading } =
    useQuery([QUERY_KEY_COLINKS, targetAddress, 'profile'], () =>
      fetchCoLinksProfile(targetAddress, currentUserProfileId)
    );
  const { data: cosoul, isLoading: fetchCoSoulIsLoading } = useQuery(
    [QUERY_KEY_COLINKS, targetAddress, 'cosoul'],
    async () => {
      return fetchCoSoul(targetAddress);
    }
  );

  const balanceNumber = Number(balance);
  const needsBootstrapping = targetIsCurrentUser && balanceNumber == 0;
  const ownedByTarget = targetBalance !== undefined && targetBalance > 0;
  const ownedByMe = balance !== undefined && balance > 0;
  const weAreLinked = ownedByTarget || ownedByMe;

  useEffect(() => {
    if (balance !== undefined) {
      setNeedsToBuyLink(balanceNumber === 0);
    }
  }, [balance]);

  if (
    (!targetProfile?.profile && !fetchCoLinksProfileIsLoading) ||
    (!fetchCoSoulIsLoading && !cosoul)
  ) {
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

  if (!targetProfile?.profile || !cosoul) {
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
          maxWidth: colinksProfileColumnWidth,
        }}
      >
        {needsToBuyLink === true ? (
          <Flex
            css={{
              alignItems: 'center',
              borderRadius: '$3',
              background: '$surface',
              overflow: 'clip',
              mb: '$xl',
              '@sm': { flexDirection: 'column' },
            }}
          >
            <Flex
              css={{
                flexGrow: 1,
                height: '100%',
                minHeight: '200px',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'bottom',
                backgroundSize: 'cover',
                backgroundImage: "url('/imgs/background/colink-other.jpg')",
                '@sm': {
                  width: '100%',
                  minHeight: '260px',
                  height: 'auto',
                },
              }}
            ></Flex>

            <Panel
              css={{
                flex: 2,
                p: 0,
                border: 'none',
                borderRadius: 0,
              }}
            >
              <Flex
                css={{
                  p: '$lg $md $sm',
                  gap: '$sm',
                  alignItems: 'center',
                }}
                column
              >
                <Text semibold>
                  {targetBalance === undefined ? (
                    <LoadingIndicator />
                  ) : targetBalance > 0 ? (
                    <Flex column css={{ alignItems: 'center', gap: '$xs' }}>
                      <Text size="large" semibold>
                        Owns Your Link
                      </Text>
                      <Text>Buy theirs to become Mutual Friends</Text>
                    </Flex>
                  ) : (
                    <Flex column css={{ alignItems: 'center', gap: '$xs' }}>
                      <Text size="large" semibold>
                        Link Up
                      </Text>
                      <Text>{`Connect to see each other's posts`}</Text>
                    </Flex>
                  )}
                </Text>
              </Flex>
              <Flex css={{ p: '$md $md' }}>
                <BuyOrSellCoLinks
                  css={{ alignItems: 'center' }}
                  subject={targetAddress}
                  address={currentUserAddress}
                  hideTitle={true}
                  constrainWidth={true}
                />
              </Flex>
            </Panel>
          </Flex>
        ) : (
          <Panel
            css={{
              border: 'none',
              display: 'none',
              '@tablet': { display: 'block', my: '$lg' },
            }}
          >
            <Flex column css={{ width: '100%' }}>
              <BuyOrSellCoLinks
                subject={targetAddress}
                address={currentUserAddress}
              />
              {needsBootstrapping && (
                <Panel info css={{ mt: '$lg', gap: '$md' }}>
                  <Text inline>
                    <strong>Buy your first Link</strong> to allow other CoLink
                    holders to buy your Link.
                  </Text>
                  <Text>
                    Your link holders will gain access to X. You will receive Y%
                    of the price when they buy or sell.
                  </Text>
                  <Text>
                    <Link> Learn More about Links</Link>
                  </Text>
                </Panel>
              )}
            </Flex>
          </Panel>
        )}
        {currentUserAddress && (
          <Flex column css={{ gap: '$md' }}>
            <AddPost targetAddress={targetAddress} />
            {targetBalance == undefined && Number(targetBalance) > 0 && (
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
              noPosts={
                (targetProfile.mutedThem ||
                  targetIsCurrentUser ||
                  weAreLinked) && (
                  <Panel noBorder>
                    {targetProfile.mutedThem
                      ? `You have muted ${targetProfile.profile.name}. Unmute to see their posts.`
                      : (targetIsCurrentUser
                          ? "You haven't"
                          : `${targetProfile.profile.name} hasn't`) +
                        ' posted yet.'}
                  </Panel>
                )
              }
            />
          </Flex>
        )}
      </Flex>
    </Flex>
  );
};
