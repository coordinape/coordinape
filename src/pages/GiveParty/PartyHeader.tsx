import React from 'react';

import { CSS } from '@stitches/react';

import { GemCoOutline } from 'icons/__generated';
import { coLinksPaths } from 'routes/paths';
import { AppLink, Flex } from 'ui';

import { PartyNav } from './PartyNav';

export const PartyHeader = ({ css }: { css?: CSS }) => {
  return (
    <Flex column css={{ alignItems: 'center', gap: '$md', pt: '$lg', ...css }}>
      <AppLink to={coLinksPaths.giveParty}>
        <GemCoOutline size="2xl" fa />
      </AppLink>
      <PartyNav />
    </Flex>
  );
};
