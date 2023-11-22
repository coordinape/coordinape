import assert from 'assert';
import React, { useContext, useEffect, useState } from 'react';

import { CoLinks } from '@coordinape/hardhat/dist/typechain/CoLinks';
import { useQuery } from 'react-query';

import { LoadingModal } from '../../../components';
import { LoadingIndicator } from '../../../components/LoadingIndicator';
import { isFeatureEnabled } from '../../../config/features';
import { ActivityList } from '../../../features/activities/ActivityList';
import { useAuthStore } from '../../../features/auth';
import { BuyOrSellCoLinks } from '../../../features/colinks/BuyOrSellCoLinks';
import { CoLinksContext } from '../../../features/colinks/CoLinksContext';
import { CoLinksHistory } from '../../../features/colinks/CoLinksHistory';
import { fetchCoSoul } from '../../../features/colinks/fetchCoSouls';
import { LinkHolders } from '../../../features/colinks/LinkHolders';
import { LinkHoldings } from '../../../features/colinks/LinkHoldings';
import { Poaps } from '../../../features/colinks/Poaps';
import { RightColumnSection } from '../../../features/colinks/RightColumnSection';
import { useCoLinks } from '../../../features/colinks/useCoLinks';
import { QUERY_KEY_COLINKS } from '../../../features/colinks/wizard/CoLinksWizard';
import { InviteCodeLink } from '../../../features/invites/InviteCodeLink';
import { Briefcase, Clock, Users } from '../../../icons/__generated';
import { client } from '../../../lib/gql/client';
import { coLinksPaths } from '../../../routes/paths';
import { AppLink, Flex, Link, Panel, Text } from '../../../ui';
import { TwoColumnSmallRightLayout } from '../../../ui/layouts';
import { CoSoulItem } from 'pages/CoSoulExplorePage/CoSoulItem';

import { CoLinksProfileHeader } from './CoLinksProfileHeader';

const LINK_HOLDERS_LIMIT = 5;
const LINKS_HOLDING_LIMIT = 5;

export const ViewProfilePageContents = ({
  targetAddress,
}: {
  targetAddress: string;
}) => {
  const { coLinks, chainId, address } = useContext(CoLinksContext);

  const profileId = useAuthStore(state => state.profileId);
  if (!profileId) {
    return null;
  }
  if (!isFeatureEnabled('soulkeys')) {
    return null;
  }

  if (!chainId || !coLinks || !address) {
    return <LoadingIndicator />;
  }
  return (
    <PageContents
      contract={coLinks}
      currentUserAddress={address}
      targetAddress={targetAddress}
      currentUserProfileId={profileId}
    />
  );
};

const fetchCoLinksProfile = async (
  address: string,
  currentProfileId: number
) => {
  const { profiles_public, mutedThem, imMuted } = await client.query(
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
          description: true,
          reputation_score: {
            total_score: true,
          },
        },
      ],
    },
    {
      operationName: 'coLinks_profile',
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
  contract,
  currentUserAddress,
  currentUserProfileId,
  targetAddress,
}: {
  contract: CoLinks;
  currentUserAddress: string;
  currentUserProfileId: number;
  targetAddress: string;
}) => {
  const [showLoading, setShowLoading] = useState(false);
  const { balance, targetBalance } = useCoLinks({
    contract,
    address: currentUserAddress,
    target: targetAddress,
  });
  const targetIsCurrentUser =
    targetAddress.toLowerCase() == currentUserAddress.toLowerCase();

  const [needsToBuyLink, setNeedsToBuyLink] = useState<boolean | undefined>(
    undefined
  );

  const { data: targetProfile } = useQuery(
    [QUERY_KEY_COLINKS, targetAddress, 'profile'],
    () => fetchCoLinksProfile(targetAddress, currentUserProfileId)
  );
  const { data: cosoul } = useQuery(
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

  if (!targetProfile?.profile || !cosoul) {
    return <LoadingModal visible={true} />;
  }

  return (
    <TwoColumnSmallRightLayout>
      <Flex column css={{ gap: '$xl', flex: 2 }}>
        <CoLinksProfileHeader
          showLoading={showLoading}
          setShowLoading={setShowLoading}
          target={targetProfile}
          currentUserAddress={currentUserAddress}
          targetAddress={targetAddress}
          contract={contract}
        />
        {needsToBuyLink === true && (
          <Flex
            css={{
              alignItems: 'center',
              mb: '$xl',
              borderRadius: '$3',
              background: '$surface',
              overflow: 'clip',
              '@sm': { flexDirection: 'column' },
            }}
          >
            <Flex
              css={{
                flexGrow: 1,
                height: '100%',
                minHeight: '200px',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                backgroundImage: "url('/imgs/background/colink-other.jpg')",
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
        )}

        {weAreLinked && (
          <Flex column>
            <ActivityList
              queryKey={[
                QUERY_KEY_COLINKS,
                'activity',
                targetProfile.profile.id,
              ]}
              onSettled={() => setShowLoading(false)}
              where={{
                private_stream: { _eq: true },
                actor_profile_id: { _eq: targetProfile.profile.id },
              }}
              noPosts={
                <Panel noBorder>
                  {targetIsCurrentUser
                    ? "You haven't"
                    : `${targetProfile.profile.name} hasn't`}{' '}
                  {'posted yet.'}
                </Panel>
              }
            />
          </Flex>
        )}
      </Flex>
      <Flex column css={{ flex: 1, gap: '$lg', mr: '$xl' }}>
        <CoSoulItem cosoul={cosoul} exploreView={false} />
        {targetIsCurrentUser && (
          <InviteCodeLink profileId={currentUserProfileId} />
        )}
        {needsToBuyLink === false && (
          <RightColumnSection>
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
          </RightColumnSection>
        )}

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
        <LinkHoldings holder={targetAddress}>
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
                <Clock /> Recent Link Transactions
              </Text>
            </Flex>
          }
        >
          <CoLinksHistory target={targetAddress} limit={5} />
        </RightColumnSection>
        <Poaps address={targetAddress} />
      </Flex>
    </TwoColumnSmallRightLayout>
  );
};
