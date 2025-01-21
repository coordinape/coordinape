import React from 'react';

import { Helmet } from 'react-helmet';

import { GiveHelpCards, GiveHomeHeader } from 'pages/GiveHome';
import { GiveReceiversLeaderboard } from 'pages/GiveReceiversLeaderboard';
import { Flex } from 'ui';

import { ResponsiveColumnLayout } from './GivePage';

export const GiveReceiversPage = () => {
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
            mb: '$md',
            '@xs': {
              mt: '$md',
            },
          }}
        >
          <GiveReceiversLeaderboard />
        </Flex>
        <GiveHelpCards />
      </ResponsiveColumnLayout>
    </Flex>
  );
};
