import React from 'react';

import { GemCoOutline } from 'icons/__generated';
import { coLinksPaths } from 'routes/paths';
import { AppLink, Button, Flex } from 'ui';

const buttonStyle = {
  fontSize: '$h1',
  fontWeight: '$normal',
  border: '1px solid transparent',
  px: '$sm',
  '&:hover': {
    borderColor: 'white',
  },
};

export const PartyHeader = () => {
  const selectedStyle = {
    borderColor: 'rgba(0,0,0,0.15) !important',
    background: 'rgba(0,0,0,0.15) !important',
    cursor: 'default',
    pointerEvents: 'none',
  };
  return (
    <Flex column css={{ alignItems: 'center', gap: '$md', pt: '$lg' }}>
      <Flex row css={{ gap: '$md' }}>
        <Button
          as={AppLink}
          to={coLinksPaths.giveParty}
          color="transparent"
          css={{
            ...buttonStyle,
            marginLeft: '17px',
            ...(location.pathname == '/giveparty' && selectedStyle),
          }}
        >
          give.party
        </Button>
        <AppLink to={coLinksPaths.giveParty}>
          <GemCoOutline size="2xl" fa />
        </AppLink>
        <Button
          as={AppLink}
          to={coLinksPaths.giveBoard}
          color="transparent"
          css={{
            ...buttonStyle,
            ...(location.pathname == '/giveboard' && selectedStyle),
          }}
        >
          leaderboard
        </Button>
      </Flex>
    </Flex>
  );
};
