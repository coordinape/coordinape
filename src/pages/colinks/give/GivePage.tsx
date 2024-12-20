import React from 'react';

import { RecentGives } from 'features/colinks/RecentGives';
import { Helmet } from 'react-helmet';
import { CSS } from 'stitches.config';

import { GemCoOutline } from 'icons/__generated';
import { GiveHelpCards, GiveHomeHeader } from 'pages/GiveHome';
import { Flex, Text } from 'ui';

export const GivePage = () => {
  return (
    <Flex column>
      <Helmet>
        <title>GIVE / Coordinape</title>
      </Helmet>
      <GiveHomeHeader />
      <Flex
        css={{
          alignItems: 'center',
          gap: '$sm',
          mb: '$lg',
          ml: '$xl',
          '@sm': {
            width: '100%',
            maxWidth: '$maxMobile',
            m: '$sm auto $lg',
          },
          '@xs': {
            pl: '$md',
          },
        }}
      >
        <GemCoOutline fa size="2xl" css={{ mt: '$xs' }} />
        <Text h2 display>
          Recent GIVE
        </Text>
      </Flex>
      <ResponsiveColumnLayout
        css={{
          '@xs': {
            gap: '0',
          },
        }}
      >
        <Flex column css={{ '@sm': { margin: 'auto' } }}>
          <RecentGives limit={35} />
        </Flex>
        <GiveHelpCards />
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
