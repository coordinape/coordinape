import { CSS } from '@stitches/react';

import { coLinksPaths } from 'routes/paths';
import { AppLink, Button, Flex } from 'ui';

export const partyNavButtonStyle = {
  fontSize: 20,
  minWidth: '7em',
  fontWeight: '$normal',
  border: '1px solid rgb(255 255 255 / 20%)',
  px: '$md',
  '&:hover': {
    borderColor: 'white',
  },
  '@xs': {
    fontSize: '$h2',
  },
};

export const PartyNav = ({ css }: { css?: CSS }) => {
  return (
    <Flex row css={{ ...css, gap: '$md' }}>
      <Button
        as={AppLink}
        to={coLinksPaths.giveParty}
        color="transparent"
        css={{ ...partyNavButtonStyle }}
      >
        give.party
      </Button>
      <Button
        as={AppLink}
        to={coLinksPaths.giveBoard}
        color="transparent"
        css={{
          ...partyNavButtonStyle,
          ...(location.pathname == '/giveboard' && {
            borderColor: 'rgba(0,0,0,0.15) !important',
            background: 'rgba(0,0,0,0.15) !important',
            cursor: 'default',
            pointerEvents: 'none',
          }),
        }}
      >
        leaderboard
      </Button>
      <Button
        as={AppLink}
        to={coLinksPaths.givemap}
        color="transparent"
        css={{
          ...partyNavButtonStyle,
          ...(location.pathname == '/givemap' && {
            borderColor: 'rgba(0,0,0,0.15) !important',
            background: 'rgba(0,0,0,0.15) !important',
            cursor: 'default',
            pointerEvents: 'none',
          }),
        }}
      >
        world of give
      </Button>
    </Flex>
  );
};
