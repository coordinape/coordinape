import { Helmet } from 'react-helmet';

import { RecentCoLinkTransactions } from '../../../features/colinks/RecentCoLinkTransactions';
import { ContentHeader, Flex, Text } from '../../../ui';
import { SingleColumnLayout } from '../../../ui/layouts';
import { ExploreBreadCrumbs } from '../explore/ExploreBreadCrumbs';

export const TradesPage = () => {
  return (
    <SingleColumnLayout>
      <Helmet>
        <title>Linking Activity / Coordinape</title>
      </Helmet>
      <ContentHeader>
        <Flex column>
          <Text h2 display>
            Explore
          </Text>
          <Text>Recent Linking Activity</Text>
          <ExploreBreadCrumbs subsection={'Linking Activity'} />
        </Flex>
      </ContentHeader>
      <RecentCoLinkTransactions />
    </SingleColumnLayout>
  );
};
