import { isFeatureEnabled } from '../../../config/features';
import { CoLinksHistory } from '../../../features/colinks/CoLinksHistory';
import { ContentHeader, Flex, Text } from '../../../ui';
import { SingleColumnLayout } from '../../../ui/layouts';
import { ExploreBreadCrumbs } from '../explore/ExploreBreadCrumbs';

export const TradesPage = () => {
  if (!isFeatureEnabled('soulkeys')) {
    return null;
  }

  return (
    <SingleColumnLayout>
      <ContentHeader>
        <Flex column>
          <Text h2 display>
            Explore
          </Text>
          <Text>Recent Link Transactions</Text>
          <ExploreBreadCrumbs subsection={'Transactions'} />
        </Flex>
      </ContentHeader>
      <CoLinksHistory />
    </SingleColumnLayout>
  );
};
