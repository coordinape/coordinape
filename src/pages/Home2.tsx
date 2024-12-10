import { TopGiveSkills } from 'features/HomeCards/TopGiveSkills';
import { TopReceivers } from 'features/HomeCards/TopReceivers';
import { TopSenders } from 'features/HomeCards/TopSenders';
import { Helmet } from 'react-helmet';

import { MostLikedCasts } from '../features/HomeCards/MostLikedCasts';
import { ContentHeader, Flex, Text } from '../ui';
import { SingleColumnLayout } from '../ui/layouts';

import { ResponsiveColumnLayout } from './colinks/give/GivePage';
import { LearnAboutGiveCard } from './colinks/give/LearnAboutGiveCard';

export const Home2Page = () => {
  return (
    <SingleColumnLayout>
      <Helmet>
        <title>Home / Coordinape</title>
      </Helmet>
      <ContentHeader>
        <Flex column css={{ gap: '$sm' }}>
          <Text h2 display>
            Explore the world of GIVE
          </Text>
          <LearnAboutGiveCard linkText="What is GIVE?" />
        </Flex>
      </ContentHeader>
      <ResponsiveColumnLayout
        css={{
          px: '0 !important',
        }}
      >
        <Flex
          column
          css={{
            mb: '$4xl',
            gap: '$2xl',
            maxWidth: '$maxMobile !important',
          }}
        >
          <MostLikedCasts />
          <TopGiveSkills tier="first" />
          <TopSenders />
          <TopGiveSkills tier="second" />
          <TopReceivers />
          <TopGiveSkills tier="third" />
        </Flex>
        <Flex column>
          <LearnAboutGiveCard />
        </Flex>
      </ResponsiveColumnLayout>
    </SingleColumnLayout>
  );
};
