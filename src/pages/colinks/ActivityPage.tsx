import { useContext, useState } from 'react';

import { CoLinks } from '@coordinape/hardhat/dist/typechain';

import { LoadingIndicator } from '../../components/LoadingIndicator';
import { isFeatureEnabled } from '../../config/features';
import { ActivityList } from '../../features/activities/ActivityList';
import { useAuthStore } from '../../features/auth';
import { CoLinksContext } from '../../features/colinks/CoLinksContext';
import { CoLinksHistory } from '../../features/colinks/CoLinksHistory';
import { Leaderboard } from '../../features/colinks/Leaderboard';
import { PostForm } from '../../features/colinks/PostForm';
import { RightColumnSection } from '../../features/colinks/RightColumnSection';
import { useCoLinks } from '../../features/colinks/useCoLinks';
import { QUERY_KEY_COLINKS } from '../../features/colinks/wizard/CoLinksWizard';
import { InviteCodeLink } from '../../features/invites/InviteCodeLink';
import { Clock, Star } from '../../icons/__generated';
import { coLinksPaths } from '../../routes/paths';
import { AppLink, ContentHeader, Flex, Text } from '../../ui';
import { TwoColumnSmallRightLayout } from '../../ui/layouts';

export const ActivityPage = () => {
  const { coLinks, address } = useContext(CoLinksContext);
  if (!coLinks || !address) {
    return <LoadingIndicator />;
  }

  if (!isFeatureEnabled('soulkeys')) {
    return null;
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

  const profileId = useAuthStore(state => state.profileId);

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
        <Flex column>
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
            <Flex as={AppLink} to={coLinksPaths.trades}>
              <Text color={'default'} semibold>
                <Clock /> Recent Link Transactions
              </Text>
            </Flex>
          }
        >
          <CoLinksHistory limit={5} />
        </RightColumnSection>
        {profileId && <InviteCodeLink profileId={profileId} />}
        <RightColumnSection
          title={
            <Flex as={AppLink} to={coLinksPaths.leaderboard}>
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
