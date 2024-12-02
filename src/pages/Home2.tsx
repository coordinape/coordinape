import { TopGiveSkills } from 'features/HomeCards/TopGiveSkills';
import { Helmet } from 'react-helmet';

import { MostLikedCasts } from '../features/HomeCards/MostLikedCasts';
import { ContentHeader, Flex, Text } from '../ui';
import { SingleColumnLayout } from '../ui/layouts';

export const Home2Page = () => {
  return (
    <SingleColumnLayout>
      <Helmet>
        <title>Home / Coordinape</title>
      </Helmet>
      <ContentHeader>
        <Flex column>
          <Text h2 display>
            Explore
          </Text>
          <Text inline>
            Who <i>are</i> these people?
          </Text>
        </Flex>
      </ContentHeader>
      <Flex column css={{ mb: '$4xl', gap: '$2xl' }}>
        <MostLikedCasts />
      </Flex>
      <Flex column css={{ mb: '$4xl', gap: '$2xl' }}>
        <TopGiveSkills />
      </Flex>
    </SingleColumnLayout>
  );
};
