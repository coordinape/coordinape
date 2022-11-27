import { useRef, useState } from 'react';

import { NavLink } from 'react-router-dom';

import { Hidden } from '@material-ui/core';

import { menuGroupStyle } from 'components/MainLayout/MainHeader';
import isFeatureEnabled from 'config/features';
import type { WalletStatus } from 'hooks/login';
import { useMyProfile } from 'recoilState/app';
import { paths } from 'routes/paths';
import {
  Avatar,
  Box,
  Link,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverClose,
  POPOVER_TIMEOUT,
  Flex,
  Button,
} from 'ui';
import { shortenAddress } from 'utils';

import { RecentTransactionsModal } from './RecentTransactionsModal';

type Props = { walletStatus: WalletStatus };
export const MyAvatarMenu = ({ walletStatus }: Props) => {
  const myProfile = useMyProfile();
  const { icon, address, logout } = walletStatus;
  const [showTxModal, setShowTxModal] = useState(false);

  const [mouseEnterPopover, setMouseEnterPopover] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const closePopover = () => {
    setMouseEnterPopover(false);
  };
  let timeoutId: ReturnType<typeof setTimeout>;

  const currentTheme = 'legacy';

  // type Tx = {
  //   timestamp: number; // Date.now() format
  //   description: string;
  //   hash?: string;
  //   status: 'pending' | 'confirmed' | 'error';
  //   chainId: string;
  // };
  // eslint-disable-next-line no-console
  // const getTheme = () => console.log(localStorage.getItem(currentTheme));

  // const saveTheme = () => localStorage.setItem(currentTheme, 'dark');

  return (
    <>
      {showTxModal && (
        <RecentTransactionsModal onClose={() => setShowTxModal(false)} />
      )}
      <Hidden smDown>
        <Popover open={mouseEnterPopover}>
          <PopoverTrigger
            tabIndex={-1}
            css={{ outline: 'none !important' }}
            ref={triggerRef}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') {
                setMouseEnterPopover(true);
              }
            }}
            onMouseDown={() => {
              clearTimeout(timeoutId);
              setMouseEnterPopover(true);
            }}
            onMouseEnter={() => {
              clearTimeout(timeoutId);
              setMouseEnterPopover(true);
            }}
            onMouseLeave={() => {
              clearTimeout(timeoutId);
              timeoutId = setTimeout(
                () => setMouseEnterPopover(false),
                POPOVER_TIMEOUT
              );
            }}
          >
            <Link href="#">
              <Avatar path={myProfile.avatar} name="me" />
            </Link>
          </PopoverTrigger>
          <PopoverContent
            onKeyDown={e => {
              if (e.key === 'Escape') {
                setMouseEnterPopover(false);
              }
            }}
            onMouseEnter={() => {
              clearTimeout(timeoutId);
              setMouseEnterPopover(true);
            }}
            onMouseLeave={() => {
              clearTimeout(timeoutId);
              timeoutId = setTimeout(
                () => setMouseEnterPopover(false),
                POPOVER_TIMEOUT
              );
            }}
            css={{
              background: '$surface',
              outline: 'none',
              zIndex: 4,
              position: 'relative',
              right: '$md',
              top: 'calc($lg - $4xl)',
            }}
            onClick={closePopover}
          >
            <Box
              css={{
                display: 'flex',
                flexDirection: 'column',
                textAlign: 'right',
                alignItems: 'end',
                p: '$md',
              }}
            >
              <PopoverClose asChild>
                <Box css={{ display: 'flex', alignItems: 'end', pb: '$md' }}>
                  <Avatar path={myProfile.avatar} />
                </Box>
              </PopoverClose>
              <Box
                css={{
                  display: 'flex',
                  alignItems: 'center',
                  mb: '$xs',
                  fontWeight: '$bold',
                  fontSize: '$large',
                }}
              >
                <Box css={{ mr: '$sm', display: 'flex' }}>{icon}</Box>
                {address && shortenAddress(address)}
              </Box>
              {isFeatureEnabled('vaults') && (
                <Link
                  type="menu"
                  css={{ fontSize: '$xs', color: '$headingText', mb: '$xs' }}
                  href="#"
                  onClick={() => setShowTxModal(true)}
                >
                  Recent Transactions
                </Link>
              )}
              <Link
                type="menu"
                css={{ fontSize: '$xs', color: '$headingText' }}
                onClick={logout}
                href="#"
              >
                Disconnect
              </Link>
              <Box css={menuGroupStyle}>
                <Link type="menu" as={NavLink} to={paths.profile('me')}>
                  Profile
                </Link>
                <Link type="menu" as={NavLink} to={paths.circles}>
                  Circles
                </Link>
                {isFeatureEnabled('vaults') && (
                  <Link type="menu" as={NavLink} to={paths.claims}>
                    Claims
                  </Link>
                )}
              </Box>
              <Flex>
                <Button
                  onClick={() => {
                    localStorage.setItem(currentTheme, 'dark');
                    // eslint-disable-next-line no-console
                    console.log(localStorage.getItem(currentTheme));
                  }}
                >
                  Dark
                </Button>
                <Button
                  onClick={() => {
                    localStorage.setItem(currentTheme, 'light');
                    // eslint-disable-next-line no-console
                    console.log(localStorage.getItem(currentTheme));
                  }}
                >
                  Light
                </Button>
                {/* <Button onClick={() => getTheme()}>light</Button> */}
              </Flex>
            </Box>
          </PopoverContent>
        </Popover>
      </Hidden>
    </>
  );
};
