import { useContext, useState } from 'react';

import { CoLinks } from '@coordinape/hardhat/dist/typechain';

import { LoadingIndicator } from '../../components/LoadingIndicator';
import { ActivityList } from '../../features/activities/ActivityList';
import { CoLinksContext } from '../../features/colinks/CoLinksContext';
import { LeaderboardMostLinks } from '../../features/colinks/LeaderboardMostLinks';
import { PostForm } from '../../features/colinks/PostForm';
import { RecentCoLinkTransactions } from '../../features/colinks/RecentCoLinkTransactions';
import { RightColumnSection } from '../../features/colinks/RightColumnSection';
import { useCoLinks } from '../../features/colinks/useCoLinks';
import { QUERY_KEY_COLINKS } from '../../features/colinks/wizard/CoLinksWizard';
import { Award, BarChart } from '../../icons/__generated';
import { coLinksPaths } from '../../routes/paths';
import { AppLink, ContentHeader, Flex, Text } from '../../ui';
import { TwoColumnSmallRightLayout } from '../../ui/layouts';

import { CoLinksTaskCards } from './CoLinksTaskCards';

export const ActivityPage = () => {
  const { coLinks, address } = useContext(CoLinksContext);
  if (!coLinks || !address) {
    return <LoadingIndicator />;
  }

  return (
    <CoLinksActivityPageContents
      coLinks={coLinks}
      currentUserAddress={address}
    />
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
              width: '100%',
            }}
          >
            {targetBalance !== undefined && targetBalance > 0 && (
              <PostForm
                showLoading={showLoading}
                onSave={() => setShowLoading(true)}
              />
            )}
          </Flex>
        </ContentHeader>
        <Flex column css={{ gap: '$1xl' }}>
          <ActivityList
            queryKey={[QUERY_KEY_COLINKS, 'activity']}
            where={{ private_stream: { _eq: true } }}
            onSettled={() => setShowLoading(false)}
          />
        </Flex>
      </Flex>
      <Flex
        column
        css={{
          gap: '$lg',
          mr: '$xl',
          '@sm': {
            mr: 0,
          },
        }}
      >
        <CoLinksTaskCards currentUserAddress={currentUserAddress} small />
        <RightColumnSection
          title={
            <Flex as={AppLink} to={coLinksPaths.linking}>
              <Text color={'default'} semibold>
                <BarChart /> Recent Linking Activity
              </Text>
            </Flex>
          }
        >
          <RecentCoLinkTransactions limit={5} />
        </RightColumnSection>
        <RightColumnSection
          title={
            <Flex as={AppLink} to={coLinksPaths.leaderboard}>
              <Text color={'default'} semibold>
                <Award /> Leaderboard
              </Text>
            </Flex>
          }
        >
          <LeaderboardMostLinks limit={5} size="small" />
        </RightColumnSection>
      </Flex>
    </TwoColumnSmallRightLayout>
  );
};
