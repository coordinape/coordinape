import assert from 'assert';
import React, { useContext, useEffect, useState } from 'react';

import { isAddress } from 'ethers/lib/utils';
import { anonClient } from 'lib/anongql/anonClient';
import { Helmet } from 'react-helmet';
import { useQuery } from 'react-query';

import { LoadingIndicator } from '../../../components/LoadingIndicator';
import { ActivityList } from '../../../features/activities/ActivityList';
import { BuyOrSellCoLinks } from '../../../features/colinks/BuyOrSellCoLinks';
import { CoLinksContext } from '../../../features/colinks/CoLinksContext';
import { fetchCoSoul } from '../../../features/colinks/fetchCoSouls';
import { LinkHolders } from '../../../features/colinks/LinkHolders';
import { LinkHoldings } from '../../../features/colinks/LinkHoldings';
import { Poaps } from '../../../features/colinks/Poaps';
import { RecentCoLinkTransactions } from '../../../features/colinks/RecentCoLinkTransactions';
import { RightColumnSection } from '../../../features/colinks/RightColumnSection';
import { SimilarProfiles } from '../../../features/colinks/SimilarProfiles';
import { useLinkingStatus } from '../../../features/colinks/useLinkingStatus';
import { QUERY_KEY_COLINKS } from '../../../features/colinks/wizard/CoLinksWizard';
import { BarChart, Briefcase, Users } from '../../../icons/__generated';
import { client } from '../../../lib/gql/client';
import { coLinksPaths } from '../../../routes/paths';
import { AppLink, Button, Flex, Link, Panel, Text } from '../../../ui';
import { NotFound } from '../NotFound';
import { CoLinksProfileHeader } from '../ViewProfilePage/CoLinksProfileHeader';
import useProfileId from 'hooks/useProfileId';
import { SingleColumnLayout } from 'ui/layouts';
import { shortenAddressWithFrontLength } from 'utils';

const LINK_HOLDERS_LIMIT = 5;
const LINKS_HOLDING_LIMIT = 5;

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
  const [showProfileDetails, setShowProfileDetails] = useState(false);
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

  const needsBootstrapping = targetIsCurrentUser && balance == 0;
  const ownedByTarget = targetBalance !== undefined && targetBalance > 0;
  const ownedByMe = balance !== undefined && balance > 0;
  const weAreLinked = ownedByTarget || ownedByMe;

  useEffect(() => {
    if (balance !== undefined) {
      setNeedsToBuyLink(balance === 0);
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
    <SingleColumnLayout>
      <Helmet>
        <title>{targetProfile.profile.name} / CoLinks</title>
      </Helmet>
      <Flex css={{ gap: '$xl' }}>
        <Flex column css={{ flexGrow: 1, maxWidth: '$readable' }}>
          <CoLinksProfileHeader
            showLoading={showLoading}
            setShowLoading={setShowLoading}
            target={targetProfile}
            currentUserAddress={currentUserAddress}
            targetAddress={targetAddress}
          />
          <Flex css={{ gap: '$sm' }}>
            <Button
              size="xs"
              color={!showCasts ? 'secondary' : 'selectedSecondary'}
              onClick={() => setShowCasts(true)}
            >
              Posts
            </Button>
            <Button
              size="xs"
              color={showCasts ? 'secondary' : 'selectedSecondary'}
              onClick={() => setShowCasts(false)}
            >
              Network
            </Button>
            <Button
              size="xs"
              color={showCasts ? 'secondary' : 'selectedSecondary'}
              onClick={() => setShowCasts(false)}
            >
              GIVE
            </Button>
            <Button
              size="xs"
              color={showCasts ? 'secondary' : 'selectedSecondary'}
              onClick={() => setShowCasts(false)}
            >
              Reputation
            </Button>
          </Flex>
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
                      Your link holders will gain access to X. You will receive
                      Y% of the price when they buy or sell.
                    </Text>
                    <Text>
                      <Link> Learn More about Links</Link>
                    </Text>
                  </Panel>
                )}
              </Flex>
            </Panel>
          )}
          <Flex
            column
            css={{
              gap: '$lg',
              display: 'none',
              '@tablet': { display: 'flex !important', mb: '$lg' },
            }}
          >
            {!weAreLinked ? (
              <ProfileLinkDetails targetAddress={targetAddress} />
            ) : (
              <>
                <Button onClick={() => setShowProfileDetails(prev => !prev)}>
                  {showProfileDetails ? 'Hide' : 'Show'} Profile Details
                </Button>
                {showProfileDetails && (
                  <>
                    <ProfileLinkDetails targetAddress={targetAddress} />
                  </>
                )}
              </>
            )}
          </Flex>
          {currentUserAddress && (
            <Flex column css={{ gap: '$md' }}>
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
                    ...(showCasts
                      ? [
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
                        ]
                      : []),
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
    </SingleColumnLayout>
  );
};

const ProfileLinkDetails = ({ targetAddress }: { targetAddress: string }) => {
  return (
    <>
      <LinkHolders target={targetAddress} limit={LINK_HOLDERS_LIMIT}>
        {(
          list: React.ReactNode,
          counts?: { link_holders: number; total_links: number }
        ) => (
          <RightColumnSection
            title={
              <Flex css={{ justifyContent: 'space-between', width: '100%' }}>
                <Text
                  as={AppLink}
                  to={coLinksPaths.holders(targetAddress)}
                  color={'default'}
                  semibold
                >
                  <Users /> {counts?.link_holders} Link Holders
                </Text>
                <Text
                  as={AppLink}
                  to={coLinksPaths.holders(targetAddress)}
                  color={'default'}
                  semibold
                >
                  {counts?.total_links} Total Links
                </Text>
              </Flex>
            }
          >
            <Flex column css={{ width: '100%' }}>
              {list}
              {counts?.link_holders &&
                counts.link_holders > LINK_HOLDERS_LIMIT && (
                  <Flex css={{ justifyContent: 'flex-end' }}>
                    <AppLink to={coLinksPaths.holders(targetAddress)}>
                      <Text size="xs">
                        View all {counts.link_holders} Holders
                      </Text>
                    </AppLink>
                  </Flex>
                )}
            </Flex>
          </RightColumnSection>
        )}
      </LinkHolders>
      <LinkHoldings holder={targetAddress} limit={LINKS_HOLDING_LIMIT}>
        {(list: React.ReactNode, heldCount?: number) => (
          <RightColumnSection
            title={
              <Text
                as={AppLink}
                to={coLinksPaths.holdings(targetAddress)}
                color={'default'}
                semibold
              >
                <Briefcase /> Holding {heldCount} Link
                {heldCount == 1 ? '' : 's'}
              </Text>
            }
          >
            <Flex column css={{ width: '100%' }}>
              {list}
              {heldCount && heldCount > LINKS_HOLDING_LIMIT && (
                <Flex css={{ justifyContent: 'flex-end' }}>
                  <AppLink to={coLinksPaths.holdings(targetAddress)}>
                    <Text size="xs">View all {heldCount} Holdings</Text>
                  </AppLink>
                </Flex>
              )}
            </Flex>
          </RightColumnSection>
        )}
      </LinkHoldings>
      <RightColumnSection
        title={
          <Flex as={AppLink} to={coLinksPaths.history(targetAddress)}>
            <Text color={'default'} semibold>
              <BarChart /> Recent Linking Activity
            </Text>
          </Flex>
        }
      >
        <RecentCoLinkTransactions target={targetAddress} limit={5} />
      </RightColumnSection>
      <Poaps address={targetAddress} />
      <SimilarProfiles address={targetAddress} />
    </>
  );
};
