import React from 'react';

import { GemCoOutline } from 'icons/__generated';
import { coLinksPaths } from 'routes/paths';
import { AppLink, Flex } from 'ui';

import { PartyNav } from './PartyNav';

export const PartyHeader = () => {
  return (
    <Flex column css={{ alignItems: 'center', gap: '$md', pt: '$lg' }}>
      <AppLink to={coLinksPaths.giveParty}>
        <GemCoOutline size="2xl" fa />
      </AppLink>
      <PartyNav />
    </Flex>
  );
};
