import React, { useEffect, useState } from 'react';

import { SoulKeys } from '@coordinape/hardhat/dist/typechain/SoulKeys';
import { useQuery } from 'react-query';

import { LoadingModal } from '../../components';
import { isFeatureEnabled } from '../../config/features';
import { ActivityList } from '../../features/activities/ActivityList';
import { CoSoulGate } from '../../features/cosoul/CoSoulGate';
import { BuyOrSellSoulKeys } from '../../features/soulkeys/BuyOrSellSoulKeys';
import { SoulKeyHistory } from '../../features/soulkeys/SoulKeyHistory';
import { SoulKeyHolders } from '../../features/soulkeys/SoulKeyHolders';
import { SoulKeysChainGate } from '../../features/soulkeys/SoulKeysChainGate';
import { SoulKeysHeld } from '../../features/soulkeys/SoulKeysHeld';
import { useSoulKeys } from '../../features/soulkeys/useSoulKeys';
import { useToast } from '../../hooks';
import { Users } from '../../icons/__generated';
import { client } from '../../lib/gql/client';
import { Avatar, ContentHeader, Flex, Panel, Text } from '../../ui';
import { SingleColumnLayout } from '../../ui/layouts';

export const ViewSoulKeyPageContents = ({
  subjectAddress,
}: {
  subjectAddress: string;
}) => {
  if (!isFeatureEnabled('soulkeys')) {
    return null;
  }

  return (
    <SoulKeysChainGate actionName="Use SoulKeys">
      {(contracts, currentUserAddress, soulKeys) => (
        <CoSoulGate
          contracts={contracts}
          address={currentUserAddress}
          message={'to Use SoulKeys'}
        >
          {() => (
            <PageContents
              soulKeys={soulKeys}
              chainId={contracts.chainId}
              currentUserAddress={currentUserAddress}
              subjectAddress={subjectAddress}
            />
          )}
        </CoSoulGate>
      )}
    </SoulKeysChainGate>
  );
};

const PageContents = ({
  soulKeys,
  chainId,
  currentUserAddress,
  subjectAddress,
}: {
  soulKeys: SoulKeys;
  chainId: string;
  currentUserAddress: string;
  subjectAddress: string;
}) => {
  const { balance, subjectBalance } = useSoulKeys({
    soulKeys,
    address: currentUserAddress,
    subject: subjectAddress,
  });
  const subjectIsCurrentUser =
    subjectAddress.toLowerCase() == currentUserAddress.toLowerCase();
  const [supply, setSupply] = useState<number | null>(null);

  const { showError } = useToast();

  useEffect(() => {
    soulKeys
      .sharesSupply(subjectAddress)
      .then(b => {
        setSupply(b.toNumber());
      })
      .catch(e => showError('Error getting supply: ' + e.message));
  }, []);

  const { data: subjectProfile } = useQuery(
    ['soulKeys', subjectAddress, 'profile'],
    async () => {
      const { profiles_public } = await client.query(
        {
          profiles_public: [
            {
              where: {
                address: {
                  _ilike: subjectAddress,
                },
              },
            },
            {
              id: true,
              name: true,
              avatar: true,
            },
          ],
        },
        {
          operationName: 'soulKeys_profile',
        }
      );
      return profiles_public.pop();
    }
  );

  const needsBootstrapping = subjectIsCurrentUser && balance == 0;

  if (!subjectProfile) {
    return <LoadingModal visible={true} />;
  }

  return (
    <SingleColumnLayout>
      <ContentHeader>
        <Flex column css={{ gap: '$sm', flexGrow: 1 }}>
          <Flex alignItems="center" css={{ gap: '$sm' }}>
            <Avatar
              size="large"
              name={subjectProfile.name}
              path={subjectProfile.avatar}
              margin="none"
              css={{ mr: '$sm' }}
            />
            <Flex column>
              <Text h2 display css={{ color: '$secondaryButtonText' }}>
                {subjectProfile.name}
              </Text>
              {!needsBootstrapping && (
                <Flex css={{ gap: '$sm', mt: '$xs' }}>
                  <Text tag color={balance == 0 ? 'warning' : 'complete'}>
                    You own {balance} Key
                    {balance == 1 ? '' : 's'}
                  </Text>
                  <Text tag color="neutral">
                    {supply !== null && supply + ` Total Keys Issued`}
                  </Text>
                </Flex>
              )}
            </Flex>
          </Flex>
        </Flex>
      </ContentHeader>
      <Flex css={{ gap: '$lg' }}>
        <Flex column css={{ gap: '$xl', flex: 2 }}>
          {balance !== undefined && balance > 0 && (
            <Flex column>
              <ActivityList
                queryKey={['soulkey_activity', subjectProfile.id]}
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
              me={
                subjectAddress.toLowerCase() ===
                currentUserAddress.toLowerCase()
              }
            />
          )}
        </Flex>
        <Flex column css={{ flex: 1, gap: '$lg', mr: '$xl' }}>
          <BuyOrSellSoulKeys
            subject={subjectAddress}
            address={currentUserAddress}
            soulKeys={soulKeys}
            chainId={chainId}
            hideName={true}
          />
          <SoulKeyHolders subject={subjectAddress} />
          <SoulKeysHeld address={subjectAddress} />
          <Panel>
            <Flex column>
              <Text
                // tag
                // color="neutral"
                size="medium"
                semibold
                css={{
                  justifyContent: 'flex-start',
                  // py: '$md',
                  // px: '$md',
                  mb: '$md',
                }}
              >
                <Users css={{ mr: '$xs' }} /> Recent Key Transactions
              </Text>
              <SoulKeyHistory subject={subjectAddress} />
            </Flex>
          </Panel>
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
