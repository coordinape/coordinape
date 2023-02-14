import { useRef, useState } from 'react';

import { useWalletStatus } from 'features/auth';
import { NavLink } from 'react-router-dom';

import { Hidden } from '@material-ui/core';

import { ThemeSwitcher } from '../../features/theming/ThemeSwitcher';
import { Network } from 'components';
import { menuGroupStyle } from 'components/MainLayout/MainHeader';
import isFeatureEnabled from 'config/features';
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
} from 'ui';
import { shortenAddress } from 'utils';

import { RecentTransactionsModal } from './RecentTransactionsModal';

type Props = {
  walletStatus: ReturnType<typeof useWalletStatus>;
  avatar: string | undefined;
};

export const MyAvatarMenu = ({ walletStatus, avatar }: Props) => {
  const { icon, address, chainId, logout } = walletStatus;
  const [showTxModal, setShowTxModal] = useState(false);

  const [mouseEnterPopover, setMouseEnterPopover] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const closePopover = () => {
    setMouseEnterPopover(false);
  };
  let timeoutId: ReturnType<typeof setTimeout>;

  if (!address) return null;

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
              <Avatar path={avatar} name="me" />
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
                  <Avatar path={avatar} />
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
                <ThemeSwitcher />
              </Box>
            </Box>
          </PopoverContent>
        </Popover>
      </Hidden>
    </>
  );
};
