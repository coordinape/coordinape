import { useState } from 'react';

import { CoLinks } from '@coordinape/hardhat/dist/typechain';

import { isFeatureEnabled } from '../../config/features';
import { ActivityList } from '../../features/activities/ActivityList';
import { CoLinksChainGate } from '../../features/colinks/CoLinksChainGate';
import { CoLinksHistory } from '../../features/colinks/CoLinksHistory';
import { QUERY_KEY_COLINKS } from '../../features/colinks/CoLinksWizard';
import { Leaderboard } from '../../features/colinks/Leaderboard';
import { PostForm } from '../../features/colinks/PostForm';
import { RightColumnSection } from '../../features/colinks/RightColumnSection';
import { useCoLinks } from '../../features/colinks/useCoLinks';
import { CoSoulGate } from '../../features/cosoul/CoSoulGate';
import { Clock, Star } from '../../icons/__generated';
import { paths } from '../../routes/paths';
import { AppLink, ContentHeader, Flex, Text } from '../../ui';
import { TwoColumnSmallRightLayout } from '../../ui/layouts';

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

  const { targetBalance } = useCoLinks({
    contract: coLinks,
    address: currentUserAddress,
    target: currentUserAddress,
  });
  return (
    <TwoColumnSmallRightLayout>
      <Flex css={{ gap: '$xl' }} column>
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
            {targetBalance !== undefined && targetBalance > 0 && (
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
      <Flex column css={{ gap: '$lg', mr: '$xl' }}>
        <RightColumnSection
          title={
            <Flex
              as={AppLink}
              to={paths.coLinksLinksHistory(currentUserAddress)}
            >
              <Text color={'default'} semibold>
                <Clock /> Recent Link Transactions
              </Text>
            </Flex>
          }
        >
          <CoLinksHistory limit={5} />
        </RightColumnSection>
        <RightColumnSection
          title={
            <Flex as={AppLink} to={paths.coLinksLeaderboard}>
              <Text color={'default'} semibold>
                <Star /> Leaderboard
              </Text>
            </Flex>
          }
        >
          <Leaderboard limit={5} board={'targets'} />
        </RightColumnSection>
      </Flex>
    </TwoColumnSmallRightLayout>
  );
};
