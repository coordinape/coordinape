import { useState } from 'react';

import { CSS } from '@stitches/react';

import { coLinksPaths } from 'routes/paths';
import { Text, AppLink, Button, Flex, Modal } from 'ui';

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
  const onClose = () => setVisible(prev => !prev);
  const [visible, setVisible] = useState(false);
  return (
    <Flex
      row
      css={{ ...css, gap: '$md', flexWrap: 'wrap', justifyContent: 'center' }}
    >
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
        onClick={() => setVisible(true)}
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
      {visible && (
        <Modal
          open={visible}
          onOpenChange={onClose}
          css={{ maxWidth: '540px', p: 0, border: 'none' }}
        >
          <Flex
            className="art"
            css={{
              flexGrow: 1,
              height: '100%',
              width: '100%',
              minHeight: '280px',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              backgroundSize: 'cover',
              backgroundImage: "url('/imgs/background/give-map-crop.jpg')",
            }}
          />
          <Flex
            column
            css={{
              gap: '$md',
              p: '$lg',
            }}
          >
            <Flex
              column
              css={{
                gap: '$sm',
              }}
            >
              <Text
                semibold
                css={{ textAlign: 'center', justifyContent: 'center' }}
              >
                The network graph of GIVE across Farcaster is a LOT of data.
              </Text>
              <Text css={{ textAlign: 'center', justifyContent: 'center' }}>
                It may take a long time to load, and some browsers may stall.{' '}
              </Text>
            </Flex>
            <Flex column css={{ gap: '$md' }}>
              <Button
                as={AppLink}
                to={coLinksPaths.givemap}
                color="cta"
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
                View GIVE Network
              </Button>
              <Text
                size="small"
                css={{ textAlign: 'center', justifyContent: 'center' }}
              >
                It is MUCH less data to view the network for a specific skill...
              </Text>
              <Button
                color="secondary"
                as={AppLink}
                to={coLinksPaths.giveBoard}
              >
                View GIVE for a particular skill
              </Button>
            </Flex>
          </Flex>
        </Modal>
      )}
    </Flex>
  );
};
