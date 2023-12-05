import { LeaderboardRepScore } from '../../../features/colinks/LeaderboardRepScore';
import { ContentHeader, Flex, Text } from '../../../ui';
import { SingleColumnLayout } from '../../../ui/layouts';

import { ExploreBreadCrumbs } from './ExploreBreadCrumbs';

export const HighestRepScorePage = () => {
  return (
    <SingleColumnLayout>
      <ContentHeader>
        <Flex column>
          <Text h2 display>
            Explore
          </Text>
          <Text>Who has the highest Rep Score?</Text>
          <ExploreBreadCrumbs subsection={'Highest Rep Score'} />
        </Flex>
      </ContentHeader>
      <Flex css={{ maxWidth: '$readable' }}>
        <LeaderboardRepScore limit={100} />
      </Flex>
    </SingleColumnLayout>
  );
};
