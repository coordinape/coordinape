import { Helmet } from 'react-helmet';

import { Flex } from '../../../ui';
import { GiveLeaderboard } from 'pages/GiveLeaderboard';
import { GiveLeaderboardNav } from 'pages/GiveLeaderboardNav';

import { GiveBotCard } from './GiveBotCard';
import { ResponsiveColumnLayout } from './GivePage';
import { GivePartyCard } from './GivePartyCard';
import { LearnAboutGiveCard } from './LearnAboutGiveCard';

export const GiveLeaderboardPage = () => {
  return (
    <Flex column>
      <Helmet>
        <title>GIVE / Coordinape</title>
      </Helmet>
      <Flex
        css={{
          gap: '$sm',
          mt: '-$lg',
          mb: '$lg',
          ml: '$xl',
        }}
      >
        <GiveLeaderboardNav />
      </Flex>
      <ResponsiveColumnLayout
        css={{
          '@xs': {
            gap: '0',
          },
        }}
      >
        <Flex column>
          <GiveLeaderboard />
        </Flex>
        <Flex
          column
          css={{
            gap: '$xl',
            flexGrow: 1,
            '@sm': {
              flexDirection: 'row',
              gap: '$sm',
              pb: '$sm',
              mt: '$lg',
              overflow: 'scroll',
              mx: '-$md',
              px: '$md',
            },
          }}
        >
          <LearnAboutGiveCard />
          <GivePartyCard />
          <GiveBotCard />
        </Flex>
      </ResponsiveColumnLayout>
    </Flex>
  );
};
