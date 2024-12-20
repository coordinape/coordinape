import { Helmet } from 'react-helmet';

import { GiveHelpCards, GiveHomeHeader } from 'pages/GiveHome';
import { GiveLeaderboard } from 'pages/GiveLeaderboard';
import { Flex } from 'ui';

import { ResponsiveColumnLayout } from './GivePage';

export const GiveLeaderboardPage = () => {
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
          <GiveLeaderboard />
        </Flex>
        <GiveHelpCards />
      </ResponsiveColumnLayout>
    </Flex>
  );
};
