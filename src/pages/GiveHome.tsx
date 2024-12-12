import { OtherGiveSkills } from 'features/HomeCards/OtherGiveSkills';
import { TopGiveSkills } from 'features/HomeCards/TopGiveSkills';
import { TopReceivers } from 'features/HomeCards/TopReceivers';
import { TopSenders } from 'features/HomeCards/TopSenders';
import { Helmet } from 'react-helmet';

import { MostLikedCasts } from '../features/HomeCards/MostLikedCasts';
import { ContentHeader, Flex, Panel, Text } from '../ui';
import { SingleColumnLayout } from '../ui/layouts';

import { ResponsiveColumnLayout } from './colinks/give/GivePage';
import { LearnAboutGiveCard } from './colinks/give/LearnAboutGiveCard';

export const QUERY_KEY_GIVE_HOME = 'giveHome';

export const GiveHomePage = () => {
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
            '@sm': {
              margin: 'auto',
            },
          }}
        >
          <Panel
            noBorder
            css={{
              backgroundSize: '10px 10px',
              backgroundImage:
                'repeating-linear-gradient(135deg, $borderDimmer 0, $borderDimmer 1.5px, $background 0, $background 50%)',
              border: '0.5px dotted $borderDimmer',
            }}
          >
            <MostLikedCasts />
          </Panel>
          <Panel
            noBorder
            css={{
              backgroundSize: '10px 10px',
              backgroundImage:
                'repeating-linear-gradient(45deg, $borderDimmer 0, $borderDimmer 1.5px, $background 0, $background 50%)',
              border: '0.5px dotted $borderDimmer',
            }}
          >
            <TopGiveSkills tier="first" />
          </Panel>
          <TopSenders />
          <Panel
            noBorder
            css={{
              backgroundSize: '10px 10px',
              backgroundImage:
                'repeating-linear-gradient(45deg, $borderDimmer 0, $borderDimmer 1.5px, $background 0, $background 50%)',
              border: '0.5px dotted $borderDimmer',
            }}
          >
            <TopGiveSkills tier="second" />
          </Panel>
          <TopReceivers />
          <Panel
            noBorder
            css={{
              backgroundSize: '10px 10px',
              backgroundImage:
                'repeating-linear-gradient(135deg, $borderDimmer 0, $borderDimmer 2px, $background 0, $background 50%)',
              border: '0.5px dotted $borderDimmer',
            }}
          >
            <TopGiveSkills tier="third" />
          </Panel>
          <Panel
            noBorder
            css={{
              background:
                'radial-gradient(circle at 25% 25%, $borderDimmer 20%, transparent 21%, transparent 100%), radial-gradient(circle at 75% 75%, $borderDimmer 15%, transparent 16%)',
              backgroundSize: '1em 1em',
              border: '0.5px dotted transparent',
            }}
          >
            <OtherGiveSkills skipFirst={3} />
          </Panel>
        </Flex>
        <Flex column>
          <LearnAboutGiveCard />
        </Flex>
      </ResponsiveColumnLayout>
    </SingleColumnLayout>
  );
};
