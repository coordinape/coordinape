import { useRef, useState } from 'react';

import { useWalletStatus } from 'features/auth';
import { NavLink } from 'react-router-dom';
import { Theme } from 'stitches.config';

import { Hidden } from '@material-ui/core';

import { menuGroupStyle } from 'components/MainLayout/MainHeader';
import isFeatureEnabled from 'config/features';
import { CloudDrizzle, Moon, Sun } from 'icons/__generated';
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
  IconButton,
  Button,
  Network,
} from 'ui';
import { shortenAddress } from 'utils';

import { RecentTransactionsModal } from './RecentTransactionsModal';

type Props = {
  walletStatus: ReturnType<typeof useWalletStatus>;
  currentTheme?: string;
  setCurrentTheme(t: Theme): void;
};

export const MyAvatarMenu = ({
  walletStatus,
  currentTheme,
  setCurrentTheme,
}: Props) => {
  const myProfile = useMyProfile();
  const { icon, address, chainId, logout } = walletStatus;
  const [showTxModal, setShowTxModal] = useState(false);

  const [mouseEnterPopover, setMouseEnterPopover] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const closePopover = () => {
    setMouseEnterPopover(false);
  };
  let timeoutId: ReturnType<typeof setTimeout>;

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
              color: '$headingText',
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
                  mb: '$sm',
                  fontWeight: '$bold',
                  fontSize: '$large',
                  color: '$text',
                }}
              >
                <Box css={{ mr: '$sm', display: 'flex' }}>{icon}</Box>
                {address && shortenAddress(address)}
              </Box>
              <Box
                css={{
                  mb: '$xs',
                }}
              >
                <Network chainId={chainId || 1} />
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
                {/* put this in your browser console to enable theme switching
                localStorage.setItem('feature:theme_switcher', 'true'); */}
                {isFeatureEnabled('theme_switcher') && (
                  <Flex
                    css={{
                      gap: '$sm',
                      justifyContent: 'end',
                      mt: '$sm',
                      alignItems: 'center',
                    }}
                  >
                    <Button
                      size="small"
                      color="transparent"
                      css={{
                        '&:hover': {
                          color: '$primary',
                        },
                        color:
                          currentTheme === 'system'
                            ? '$text !important'
                            : '$secondaryText',
                      }}
                      onClick={() => {
                        // fixme for utilizing OS theme selection
                        setCurrentTheme(undefined);
                      }}
                    >
                      AUTO
                    </Button>
                    <IconButton
                      css={{
                        p: 0,
                        '&:hover': {
                          color: '$primary',
                        },
                        color:
                          currentTheme == undefined
                            ? '$text !important'
                            : currentTheme == 'undefined'
                            ? '$text !important'
                            : '$secondaryText',
                      }}
                      onClick={() => {
                        setCurrentTheme(undefined);
                      }}
                    >
                      <CloudDrizzle />
                    </IconButton>
                    <IconButton
                      css={{
                        p: 0,
                        '&:hover': {
                          color: '$primary',
                        },
                        color:
                          currentTheme === 'dark'
                            ? '$text !important'
                            : '$secondaryText',
                      }}
                      onClick={() => {
                        setCurrentTheme('dark');
                      }}
                    >
                      <Moon />
                    </IconButton>
                    <IconButton
                      css={{
                        p: 0,
                        '&:hover': {
                          color: '$primary',
                        },
                        color:
                          currentTheme === 'light'
                            ? '$text !important'
                            : '$secondaryText',
                      }}
                      onClick={() => {
                        setCurrentTheme('light');
                      }}
                    >
                      <Sun />
                    </IconButton>
                  </Flex>
                )}
              </Box>
            </Box>
          </PopoverContent>
        </Popover>
      </Hidden>
    </>
  );
};
