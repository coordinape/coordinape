import { CSS } from '@stitches/react';

import { GemCoOutline } from 'icons/__generated';
import { PartyWalletMenu } from 'pages/PartyWalletMenu';
import { coLinksPaths } from 'routes/paths';
import { AppLink, Flex } from 'ui';

import { PartyNav } from './PartyNav';

export const PartyHeader = ({ css }: { css?: CSS }) => {
  return (
    <Flex
      css={{
        gap: '$md',
        pt: '$lg',
        justifyContent: 'space-between',
        alignItems: 'center',
        '@sm': {
          alignItems: 'flex-start',
        },
      }}
    >
      <Flex css={{ alignItems: 'center', gap: '$md', ...css }}>
        <AppLink to={coLinksPaths.giveParty}>
          <GemCoOutline size="2xl" fa />
        </AppLink>
        <PartyNav />
      </Flex>
      <Flex
        css={{
          position: 'relative',
          height: '$xl',
          width: 280,
        }}
      >
        <PartyWalletMenu />
      </Flex>
    </Flex>
  );
};
