import React from 'react';

import { Helmet } from 'react-helmet';

import { coLinksPaths } from '../../../routes/paths';
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
        <title>GIVE / CoLinks</title>
      </Helmet>
      <ResponsiveColumnLayout
        smallColumnReverse
        css={{
          '@xs': {
            gap: '0',
          },
        }}
      >
        <GiveLeaderboard linkFunc={coLinksPaths.giveSkill} />
        <Flex column css={{ gap: '$xl', flexGrow: 1 }}>
          <GivePartyCard />
          <GiveBotCard />
          <LearnAboutGiveCard />
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