import { LeaderboardHoldingMost } from '../../../features/colinks/LeaderboardHoldingMost';
import { ContentHeader, Flex, Text } from '../../../ui';
import { SingleColumnLayout } from '../../../ui/layouts';

import { ExploreBreadCrumbs } from './ExploreBreadCrumbs';

export const HoldingMostLinksPage = () => {
  return (
    <SingleColumnLayout>
      <ContentHeader>
        <Flex column>
          <Text h2 display>
            Explore
          </Text>
          <Text>Who has bought the most links?</Text>
          <ExploreBreadCrumbs subsection={'Holding Most'} />
        </Flex>
      </ContentHeader>
      <Flex css={{ maxWidth: '$readable' }}>
        <LeaderboardHoldingMost limit={100} />
      </Flex>
    </SingleColumnLayout>
  );
};
