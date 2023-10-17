import React, { useEffect, useState } from 'react';

import { useQuery } from 'react-query';

import { LoadingModal } from '../../components';
import { isFeatureEnabled } from '../../config/features';
import { Contracts } from '../../features/cosoul/contracts';
import { CoSoulGate } from '../../features/cosoul/CoSoulGate';
import { BuyOrSellSoulKeys } from '../../features/soulkeys/BuyOrSellSoulKeys';
import { CoSoulChainGate } from '../../features/soulkeys/CoSoulChainGate';
import { SoulKeyHistory } from '../../features/soulkeys/SoulKeyHistory';
import { SoulKeyHolders } from '../../features/soulkeys/SoulKeyHolders';
import { SoulKeysHeld } from '../../features/soulkeys/SoulKeysHeld';
import { useSoulKeys } from '../../features/soulkeys/useSoulKeys';
import { useToast } from '../../hooks';
import { client } from '../../lib/gql/client';
import { Avatar, ContentHeader, Flex, Text } from '../../ui';
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
    <CoSoulChainGate actionName="Use SoulKeys">
      {(contracts, currentUserAddress) => (
        <CoSoulGate
          contracts={contracts}
          address={currentUserAddress}
          message={'to Use SoulKeys'}
        >
          {() => (
            <PageContents
              contracts={contracts}
              currentUserAddress={currentUserAddress}
              subjectAddress={subjectAddress}
            />
          )}
        </CoSoulGate>
      )}
    </CoSoulChainGate>
  );
};

const PageContents = ({
  contracts,
  currentUserAddress,
  subjectAddress,
}: {
  contracts: Contracts;
  currentUserAddress: string;
  subjectAddress: string;
}) => {
  const { balance } = useSoulKeys({
    contracts,
    address: currentUserAddress,
    subject: subjectAddress,
  });
  const subjectIsCurrentUser =
    subjectAddress.toLowerCase() == currentUserAddress.toLowerCase();
  const [supply, setSupply] = useState<number | null>(null);

  const { showError } = useToast();

  useEffect(() => {
    contracts.soulKeys
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
                <Flex css={{ gap: '$sm' }}>
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
          <BuyOrSellSoulKeys
            subject={subjectAddress}
            address={currentUserAddress}
            contracts={contracts}
            hideName={true}
          />
          <SoulKeyHistory subject={subjectAddress} />
        </Flex>
        <Flex column css={{ flex: 1, gap: '$xl', mr: '$xl' }}>
          <SoulKeyHolders subject={subjectAddress} />
          <SoulKeysHeld address={currentUserAddress} />
        </Flex>
      </Flex>
    </SingleColumnLayout>
  );
};
