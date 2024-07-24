/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useRef, useState } from 'react';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { PointsBar } from 'features/points/PointsBar';
import { useAccount } from 'wagmi';

import useProfileId from 'hooks/useProfileId';
import { Flex, Text } from 'ui';

import { profileColumnWidth } from './GiveParty/PartyProfile';

export const NavProfileWidth = '165px';

export const PartyWalletMenu = () => {
  const [open, setOpen] = useState(false);
  // const name = data?.profile.name;
  // const avatar = data?.profile.avatar;

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        ref.current &&
        event.target &&
        !ref.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, []);

  const account = useAccount();
  const walletConnected = !!account.address;
  const profileId = useProfileId(false);

  return (
    <Flex
      column
      css={{
        minWidth: 226,
        maxWidth: profileColumnWidth,
        gap: '$sm',
        position: 'absolute',
        right: 0,
        // top: '$sm',
        alignItems: 'flex-end',
        zIndex: 3,
      }}
    >
      {walletConnected && profileId ? (
        <>
          <Flex
            css={{
              '>div': {
                flexDirection: 'column',
                gap: '$sm !important',
                button: {
                  borderRadius: '$3 !important',
                  fontSize: '$small !important',
                  '>div': {
                    borderRadius: '$3 !important',
                  },
                  'svg title+path': {
                    fill: 'transparent',
                  },
                },
              },
            }}
          >
            <ConnectButton />
          </Flex>
          <PointsBar forceTheme="dark" />
        </>
      ) : (
        <Flex
          css={{
            button: {
              borderRadius: '$3 !important',
              background: 'rgba(0,0,0,0.55) !important',
            },
          }}
        >
          <ConnectButton />
        </Flex>
      )}
    </Flex>
  );
};
