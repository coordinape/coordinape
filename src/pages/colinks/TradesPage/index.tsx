import { RecentCoLinkTransactions } from '../../../features/colinks/RecentCoLinkTransactions';
import { ContentHeader, Flex, Text } from '../../../ui';
import { SingleColumnLayout } from '../../../ui/layouts';
import { ExploreBreadCrumbs } from '../explore/ExploreBreadCrumbs';

export const TradesPage = () => {
  return (
    <SingleColumnLayout>
      <ContentHeader>
        <Flex column>
          <Text h2 display>
            Explore
          </Text>
          <Text>Recent Linking Activity</Text>
          <ExploreBreadCrumbs subsection={'Transactions'} />
        </Flex>
      </ContentHeader>
      <RecentCoLinkTransactions />
    </SingleColumnLayout>
  );
};
