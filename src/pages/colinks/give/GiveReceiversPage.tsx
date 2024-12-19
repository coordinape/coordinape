import React from 'react';

import { Helmet } from 'react-helmet';

import { GemCoOutline } from 'icons/__generated';
import { GiveHomeHeader } from 'pages/GiveHome';
import { GiveReceiversLeaderboard } from 'pages/GiveReceiversLeaderboard';
import { Text, Flex } from 'ui';

import { GiveBotCard } from './GiveBotCard';
import { ResponsiveColumnLayout } from './GivePage';
import { GivePartyCard } from './GivePartyCard';
import { LearnAboutGiveCard } from './LearnAboutGiveCard';

export const GiveReceiversPage = () => {
  return (
    <Flex column>
      <Helmet>
        <title>GIVE / Coordinape</title>
      </Helmet>
      <GiveHomeHeader>
        <Flex css={{ alignItems: 'center', gap: '$sm' }}>
          <GemCoOutline fa size="2xl" css={{ mt: '$xs' }} />
          <Text h2 display>
            Top GIVE Receivers
          </Text>
        </Flex>
      </GiveHomeHeader>
      <ResponsiveColumnLayout
        css={{
          '@xs': {
            gap: '0',
          },
        }}
      >
        <Flex column>
          <GiveReceiversLeaderboard />
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
