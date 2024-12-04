import React from 'react';

import { Helmet } from 'react-helmet';

import { CSS } from '../../../stitches.config';
import { Flex } from '../../../ui';
import { GiveLeaderboard } from '../../GiveLeaderboard';

import { GiveBotCard } from './GiveBotCard';
import { GivePartyCard } from './GivePartyCard';
import { LearnAboutGiveCard } from './LearnAboutGiveCard';

export const GivePage = () => {
  return (
    <Flex column>
      <Helmet>
        <title>GIVE / Coordinape</title>
      </Helmet>
      <ResponsiveColumnLayout
        css={{
          '@xs': {
            gap: '0',
          },
        }}
      >
        <GiveLeaderboard />
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

export const ResponsiveColumnLayout = ({
  children,
  css,
  smallColumnReverse = false,
}: {
  children: React.ReactNode;
  smallColumnReverse?: boolean;
  css?: CSS;
}) => {
  return (
    <Flex
      css={{
        px: '$xl',
        flexDirection: 'row',
        '@sm': {
          flexDirection: smallColumnReverse ? 'column-reverse' : 'column',
          px: '$md',
        },
        width: '100%',
        maxWidth: '$mediumScreen',
        '& > div:first-child': {
          flexGrow: 1,
          maxWidth: '$readable',
        },

        '& > div:nth-child(2)': {
          maxWidth: '$rightColumn',
          flexGrow: 0,
          '@sm': {
            maxWidth: 'none',
          },
        },
        gap: '$md',
        ...css,
      }}
    >
      {children}
    </Flex>
  );
};
