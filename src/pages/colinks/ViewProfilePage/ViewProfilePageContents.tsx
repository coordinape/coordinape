import { useState } from 'react';

import { CoLinks } from '@coordinape/hardhat/dist/typechain/CoLinks';
import { Mutes } from 'features/colinks/Mutes';
import { useQuery } from 'react-query';

import { LoadingModal } from '../../../components';
import { isFeatureEnabled } from '../../../config/features';
import { ActivityList } from '../../../features/activities/ActivityList';
import { BuyOrSellCoLinks } from '../../../features/colinks/BuyOrSellCoLinks';
import { CoLinksChainGate } from '../../../features/colinks/CoLinksChainGate';
import { CoLinksHeld } from '../../../features/colinks/CoLinksHeld';
import { CoLinksHistory } from '../../../features/colinks/CoLinksHistory';
import { CoLinksHolders } from '../../../features/colinks/CoLinksHolders';
import { QUERY_KEY_COLINKS } from '../../../features/colinks/CoLinksWizard';
import { fetchCoSoul } from '../../../features/colinks/fetchCoSouls';
import { Poaps } from '../../../features/colinks/Poaps';
import { RightColumnSection } from '../../../features/colinks/RightColumnSection';
import { useCoLinks } from '../../../features/colinks/useCoLinks';
import { CoSoulGate } from '../../../features/cosoul/CoSoulGate';
import { Clock } from '../../../icons/__generated';
import { client } from '../../../lib/gql/client';
import { Flex, Link, Panel, Text } from '../../../ui';
import { SingleColumnLayout } from '../../../ui/layouts';
import { CoSoulItem } from 'pages/CoSoulExplorePage/CoSoulItem';

import { CoLinksProfileHeader } from './CoLinksProfileHeader';

export const ViewProfilePageContents = ({
  targetAddress,
}: {
  targetAddress: string;
}) => {
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
            />
          )}
        </CoSoulGate>
      )}
    </CoLinksChainGate>
  );
};

const fetchCoLinksProfile = async (address: string) => {
  const { profiles_public } = await client.query(
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
  return profiles_public.pop();
};
export type CoLinksProfile = NonNullable<
  Awaited<ReturnType<typeof fetchCoLinksProfile>>
>;

const PageContents = ({
  contract,
  chainId,
  currentUserAddress,
  targetAddress,
}: {
  contract: CoLinks;
  chainId: string;
  currentUserAddress: string;
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

  const { data: subjectProfile } = useQuery(
    [QUERY_KEY_COLINKS, targetAddress, 'profile'],
    () => fetchCoLinksProfile(targetAddress)
  );
  const { data: cosoul } = useQuery(
    [QUERY_KEY_COLINKS, targetAddress, 'cosoul'],
    async () => {
      return fetchCoSoul(targetAddress);
    }
  );

  const needsBootstrapping = subjectIsCurrentUser && balance == 0;

  if (!subjectProfile || !cosoul) {
    return <LoadingModal visible={true} />;
  }

  return (
    <SingleColumnLayout>
      <Flex css={{ gap: '$lg' }}>
        <Flex column css={{ gap: '$xl', flex: 2 }}>
          <CoLinksProfileHeader
            showLoading={showLoading}
            setShowLoading={setShowLoading}
            profile={subjectProfile}
            currentUserAddress={currentUserAddress}
            targetAddress={targetAddress}
            contract={contract}
          />
          {balance !== undefined && balance > 0 && (
            <Flex column>
              <ActivityList
                queryKey={[QUERY_KEY_COLINKS, 'activity', subjectProfile.id]}
                onSettled={() => setShowLoading(false)}
                where={{
                  private_stream: { _eq: true },
                  actor_profile_id: { _eq: subjectProfile.id },
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
          {!subjectIsCurrentUser && (
            <RightColumnSection title={'Muting'}>
              <Mutes targetProfileId={subjectProfile.id} />
            </RightColumnSection>
          )}
          <CoLinksHolders target={targetAddress} />
          <CoLinksHeld holder={targetAddress} />
          <RightColumnSection
            title={
              <Flex>
                <Clock /> Recent Link Transactions
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
