import { CSS } from '@stitches/react';

import { PartySearchBox } from '../../features/SearchBox/PartySearchBox';
import { coLinksPaths } from 'routes/paths';
import { AppLink, Button, Flex } from 'ui';

export const partyNavButtonStyle = {
  minWidth: '7em',
  border: '1px solid rgb(255 255 255 / 25%)',
  px: '$md',
  '&:hover': {
    borderColor: 'rgb(255 255 255 / 75%)',
    borderStyle: 'dashed',
  },
  '@xs': {
    fontSize: '$h2',
  },
};

export const PartyNav = ({ css }: { css?: CSS }) => {
  return (
    <Flex css={{ gap: '$md', flexWrap: 'wrap' }}>
      <Flex row css={{ ...css, gap: '$md', flexWrap: 'wrap' }}>
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
          to={coLinksPaths.givePartyBoard}
          color="transparent"
          css={{
            ...partyNavButtonStyle,
          }}
        >
          leaderboard
        </Button>
      </Flex>
      <Flex
        css={{
          '>button': {
            px: '$md',
            py: '$sm',
            borderColor: 'rgba(0,0,0,0.15) !important',
            background: 'rgba(0,0,0,0.15) !important',
            '&:hover': {
              borderColor: 'white',
            },
            // fontSize: 18,
          },
        }}
      >
        <PartySearchBox />
      </Flex>
    </Flex>
  );
};
