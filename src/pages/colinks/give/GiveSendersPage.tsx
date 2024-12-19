import { Helmet } from 'react-helmet';

import { GiveHomeHeader } from 'pages/GiveHome';
import { GiveSendersLeaderboard } from 'pages/GiveSendersLeaderboard';
import { Flex } from 'ui';

import { GiveBotCard } from './GiveBotCard';
import { ResponsiveColumnLayout } from './GivePage';
import { GivePartyCard } from './GivePartyCard';
import { LearnAboutGiveCard } from './LearnAboutGiveCard';

export const GiveSendersPage = () => {
  return (
    <Flex column>
      <Helmet>
        <title>GIVE / Coordinape</title>
      </Helmet>
      <GiveHomeHeader />
      <ResponsiveColumnLayout
        css={{
          '@xs': {
            gap: '0',
          },
        }}
      >
        <Flex
          column
          css={{
            '@xs': {
              mt: '$md',
            },
          }}
        >
          <GiveSendersLeaderboard />
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
