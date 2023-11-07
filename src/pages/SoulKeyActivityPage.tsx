import React, { useState } from 'react';

import { SoulKeys } from '@coordinape/hardhat/dist/typechain';
import { PostForm } from 'features/soulkeys/PostForm';

import { isFeatureEnabled } from '../config/features';
import { ActivityList } from '../features/activities/ActivityList';
import { CoSoulGate } from '../features/cosoul/CoSoulGate';
import { RightColumnSection } from '../features/soulkeys/RightColumnSection';
import { SoulKeyHistory } from '../features/soulkeys/SoulKeyHistory';
import { SoulKeysChainGate } from '../features/soulkeys/SoulKeysChainGate';
import { useSoulKeys } from '../features/soulkeys/useSoulKeys';
import { Clock } from '../icons/__generated';
import { ContentHeader, Flex, Text } from '../ui';
import { SingleColumnLayout } from '../ui/layouts';

export const SoulKeyActivityPage = () => {
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
            <SoulKeyActivityPageContents
              soulKeys={soulKeys}
              currentUserAddress={currentUserAddress}
            />
          )}
        </CoSoulGate>
      )}
    </SoulKeysChainGate>
  );
};

const SoulKeyActivityPageContents = ({
  soulKeys,
  currentUserAddress,
}: {
  soulKeys: SoulKeys;
  currentUserAddress: string;
}) => {
  const [showLoading, setShowLoading] = useState(false);

  const { subjectBalance } = useSoulKeys({
    soulKeys,
    address: currentUserAddress,
    subject: currentUserAddress,
  });
  return (
    <SingleColumnLayout css={{ flexGrow: 1 }}>
      <Flex css={{ gap: '$lg' }}>
        <Flex css={{ flex: 2 }} column>
          <ContentHeader>
            <Flex
              column
              css={{
                gap: '$md',
                flexGrow: 1,
                alignItems: 'flex-start',
              }}
            >
              <Text h2 display>
                Activity Stream
              </Text>
              {subjectBalance !== undefined && subjectBalance > 0 && (
                <PostForm
                  showLoading={showLoading}
                  onSave={() => setShowLoading(true)}
                />
              )}
            </Flex>
          </ContentHeader>
          <Flex>
            <ActivityList
              queryKey={['soulkey_activity']}
              where={{ private_stream: { _eq: true } }}
              onSettled={() => setShowLoading(false)}
            />
          </Flex>
        </Flex>
        <Flex css={{ flex: 1 }}>
          <RightColumnSection
            title={
              <Flex>
                <Clock /> Recent Key Transactions
              </Flex>
            }
          >
            <SoulKeyHistory />
          </RightColumnSection>
        </Flex>
      </Flex>
    </SingleColumnLayout>
  );
};
