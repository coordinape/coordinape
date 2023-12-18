import { LeaderboardNewest } from '../../../features/colinks/LeaderboardNewest';
import { ContentHeader, Flex, Text } from '../../../ui';
import { SingleColumnLayout } from '../../../ui/layouts';

import { ExploreBreadCrumbs } from './ExploreBreadCrumbs';

export const NewestMemberPage = () => {
  return (
    <SingleColumnLayout>
      <ContentHeader>
        <Flex column>
          <Text h2 display>
            Explore
          </Text>
          <Text>Newest CoLinks Members</Text>
          <ExploreBreadCrumbs subsection={'Newest Members'} />
        </Flex>
      </ContentHeader>
      <Flex css={{ maxWidth: '$readable' }}>
        <LeaderboardNewest limit={100} />
      </Flex>
    </SingleColumnLayout>
  );
};
