import assert from 'assert';
import { useState } from 'react';

import { CoLinks } from '@coordinape/hardhat/dist/typechain/CoLinks';
import { useQuery } from 'react-query';

import { LoadingModal } from '../../../components';
import { isFeatureEnabled } from '../../../config/features';
import { ActivityList } from '../../../features/activities/ActivityList';
import { useAuthStore } from '../../../features/auth';
import { BuyOrSellCoLinks } from '../../../features/colinks/BuyOrSellCoLinks';
import { CoLinksChainGate } from '../../../features/colinks/CoLinksChainGate';
import { CoLinksHistory } from '../../../features/colinks/CoLinksHistory';
import { QUERY_KEY_COLINKS } from '../../../features/colinks/CoLinksWizard';
import { fetchCoSoul } from '../../../features/colinks/fetchCoSouls';
import { LinkHolders } from '../../../features/colinks/LinkHolders';
import { LinkHoldings } from '../../../features/colinks/LinkHoldings';
import { Poaps } from '../../../features/colinks/Poaps';
import { RightColumnSection } from '../../../features/colinks/RightColumnSection';
import { useCoLinks } from '../../../features/colinks/useCoLinks';
import { CoSoulGate } from '../../../features/cosoul/CoSoulGate';
import { Briefcase, Clock, Users } from '../../../icons/__generated';
import { client } from '../../../lib/gql/client';
import { paths } from '../../../routes/paths';
import { AppLink, Flex, Link, Panel, Text } from '../../../ui';
import { SingleColumnLayout } from '../../../ui/layouts';
import { CoSoulItem } from 'pages/CoSoulExplorePage/CoSoulItem';

import { CoLinksProfileHeader } from './CoLinksProfileHeader';

const LINK_HOLDERS_LIMIT = 5;
const LINKS_HOLDING_LIMIT = 5;

export const ViewProfilePageContents = ({
  targetAddress,
}: {
  targetAddress: string;
}) => {
  const profileId = useAuthStore(state => state.profileId);

  if (!profileId) {
    return null;
  }
  if (!isFeatureEnabled('soulkeys')) {
    return null;
  }

  return (
    <CoLinksChainGate actionName="Use CoLinks">
      {(contracts, currentUserAddress, coLinks) => (
        <CoSoulGate
          contracts={contracts}
          address={currentUserAddress}
          message={'to Use CoLinks'}
        >
          {() => (
            <PageContents
              contract={coLinks}
              chainId={contracts.chainId}
              currentUserAddress={currentUserAddress}
              targetAddress={targetAddress}
              currentUserProfileId={profileId}
            />
          )}
        </CoSoulGate>
      )}
    </CoLinksChainGate>
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

  // eslint-disable-next-line no-console
  console.log('MutedThem', mutedThem, mutedThemI, currentProfileId, address);
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
  chainId,
  currentUserAddress,
  currentUserProfileId,
  targetAddress,
}: {
  contract: CoLinks;
  chainId: string;
  currentUserAddress: string;
  currentUserProfileId: number;
  targetAddress: string;
}) => {
  const [showLoading, setShowLoading] = useState(false);
  const { balance, subjectBalance } = useCoLinks({
    contract,
    address: currentUserAddress,
    subject: targetAddress,
  });
  const subjectIsCurrentUser =
    targetAddress.toLowerCase() == currentUserAddress.toLowerCase();

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

  const needsBootstrapping = subjectIsCurrentUser && balance == 0;

  if (!targetProfile?.profile || !cosoul) {
    return <LoadingModal visible={true} />;
  }

  return (
    <SingleColumnLayout>
      <Flex css={{ gap: '$lg' }}>
        <Flex column css={{ gap: '$xl', flex: 2 }}>
          <CoLinksProfileHeader
            showLoading={showLoading}
            setShowLoading={setShowLoading}
            target={targetProfile}
            currentUserAddress={currentUserAddress}
            targetAddress={targetAddress}
            contract={contract}
          />
          {balance !== undefined && balance > 0 && (
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
              />
            </Flex>
          )}
          {balance === 0 && subjectBalance !== undefined && (
            <NoBalancePanel
              subjectBalance={subjectBalance}
              me={subjectIsCurrentUser}
            />
          )}
        </Flex>
        <Flex column css={{ flex: 1, gap: '$lg', mr: '$xl' }}>
          <CoSoulItem cosoul={cosoul} expandedView={false} />
          <RightColumnSection>
            <Flex column css={{ width: '100%' }}>
              <BuyOrSellCoLinks
                subject={targetAddress}
                address={currentUserAddress}
                coLinks={contract}
                chainId={chainId}
                hideName={true}
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
          <LinkHolders target={targetAddress} limit={LINK_HOLDERS_LIMIT}>
            {(list: React.ReactNode, holdersCount?: number) => (
              <RightColumnSection
                title={
                  <Text
                    as={AppLink}
                    to={paths.coLinksLinkHolders(targetAddress)}
                    color={'default'}
                    semibold
                  >
                    <Users /> {holdersCount} Link Holders
                  </Text>
                }
              >
                <Flex column css={{ width: '100%' }}>
                  {list}
                  {holdersCount && holdersCount > LINK_HOLDERS_LIMIT && (
                    <Flex css={{ justifyContent: 'flex-end' }}>
                      <AppLink to={paths.coLinksLinkHolders(targetAddress)}>
                        <Text size="xs">View all {holdersCount} Holders</Text>
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
                    to={paths.coLinksLinkHoldings(targetAddress)}
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
                      <AppLink to={paths.coLinksLinkHoldings(targetAddress)}>
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
              <Flex as={AppLink} to={paths.coLinksLinksHistory(targetAddress)}>
                <Text color={'default'} semibold>
                  <Clock /> Recent Link Transactions
                </Text>
              </Flex>
            }
          >
            <CoLinksHistory target={targetAddress} />
          </RightColumnSection>
          <Poaps address={targetAddress} />
        </Flex>
      </Flex>
    </SingleColumnLayout>
  );
};

const NoBalancePanel = ({
  // balance,
  subjectBalance,
  me,
}: {
  // balance: number;
  subjectBalance: number;
  me: boolean;
}) => {
  return (
    <Panel info>
      <Flex column css={{ gap: '$md' }}>
        {me ? (
          <Flex column css={{ gap: '$md' }}>
            <Text size="xl" semibold>
              You need to buy your own key bro!!!
            </Text>
            <Text size="xl" semibold>
              Kinda embarassing that you don&apos;t have it tbh.
            </Text>
          </Flex>
        ) : (
          <>
            <Text size="xl" semibold>
              {`You need to buy this bro. You don't have their key yet.`}
              {subjectBalance === 0 &&
                `You can't see each other's activity because they don't have your key either`}
            </Text>
            <Text size="xl" semibold>
              {subjectBalance === 0
                ? `They don't own your keys`
                : `They already own your key!`}
            </Text>
          </>
        )}
      </Flex>
    </Panel>
  );
};
