import { useState } from 'react';

import { CoLinks } from '@coordinape/hardhat/dist/typechain';

import { isFeatureEnabled } from '../../config/features';
import { ActivityList } from '../../features/activities/ActivityList';
import { CoLinksChainGate } from '../../features/colinks/CoLinksChainGate';
import { CoLinksHistory } from '../../features/colinks/CoLinksHistory';
import { QUERY_KEY_COLINKS } from '../../features/colinks/CoLinksWizard';
import { PostForm } from '../../features/colinks/PostForm';
import { RightColumnSection } from '../../features/colinks/RightColumnSection';
import { useCoLinks } from '../../features/colinks/useCoLinks';
import { CoSoulGate } from '../../features/cosoul/CoSoulGate';
import { Clock } from '../../icons/__generated';
import { ContentHeader, Flex, Text } from '../../ui';
import { SingleColumnLayout } from '../../ui/layouts';

export const ActivityPage = () => {
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
            <CoLinksActivityPageContents
              coLinks={coLinks}
              currentUserAddress={currentUserAddress}
            />
          )}
        </CoSoulGate>
      )}
    </CoLinksChainGate>
  );
};

const CoLinksActivityPageContents = ({
  coLinks,
  currentUserAddress,
}: {
  coLinks: CoLinks;
  currentUserAddress: string;
}) => {
  const [showLoading, setShowLoading] = useState(false);

  const { subjectBalance } = useCoLinks({
    coLinks,
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
              queryKey={[QUERY_KEY_COLINKS, 'activity']}
              where={{ private_stream: { _eq: true } }}
              onSettled={() => setShowLoading(false)}
            />
          </Flex>
        </Flex>
        <Flex css={{ flex: 1 }}>
          <RightColumnSection
            title={
              <Flex>
                <Clock /> Recent Link Transactions
              </Flex>
            }
          >
            <CoLinksHistory />
          </RightColumnSection>
        </Flex>
      </Flex>
    </SingleColumnLayout>
  );
};
