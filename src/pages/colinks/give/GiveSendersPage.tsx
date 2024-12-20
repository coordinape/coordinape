import { Helmet } from 'react-helmet';

import { GiveHelpCards, GiveHomeHeader } from 'pages/GiveHome';
import { GiveSendersLeaderboard } from 'pages/GiveSendersLeaderboard';
import { Flex } from 'ui';

import { ResponsiveColumnLayout } from './GivePage';

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
        <GiveHelpCards />
      </ResponsiveColumnLayout>
    </Flex>
  );
};
