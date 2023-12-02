import { LeaderboardMostLinks } from '../../../features/colinks/LeaderboardMostLinks';
import { ContentHeader, Flex, Text } from '../../../ui';
import { SingleColumnLayout } from '../../../ui/layouts';

import { ExploreBreadCrumbs } from './ExploreBreadCrumbs';

export const MostLinksPage = () => {
  return (
    <SingleColumnLayout>
      <ContentHeader>
        <Flex column>
          <Text h2 display>
            Explore
          </Text>
          <Text>Who have people bought the most links to?</Text>
          <ExploreBreadCrumbs subsection={'Most Links'} />
        </Flex>
      </ContentHeader>
      <Flex css={{ maxWidth: '$readable' }}>
        <LeaderboardMostLinks limit={100} />
      </Flex>
    </SingleColumnLayout>
  );
};
