import { useRef, useState } from 'react';

import { NavLink } from 'react-router-dom';

import { Hidden } from '@material-ui/core';

import { menuGroupStyle } from 'components/MainLayout/MainHeader';
import isFeatureEnabled from 'config/features';
import { useWalletStatus } from 'hooks/login';
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
} from 'ui';
import { shortenAddress } from 'utils';

import { RecentTransactionsModal } from './RecentTransactionsModal';

export const MyAvatarMenu = () => {
  const myProfile = useMyProfile();
  const { icon, address, logout } = useWalletStatus();
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
            css={{ outline: 'none' }}
            asChild
            ref={triggerRef}
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
              <Avatar
                path={myProfile.avatar}
                name={myProfile.discord_username}
                size="medium"
              />
            </Link>
          </PopoverTrigger>
          <PopoverContent
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
            // These offset values must be dialed in browser.  CSS values/strings cannot be used, only numbers.
            sideOffset={-66}
            alignOffset={-16}
            css={{ background: '$surface', outline: 'none', zIndex: 2 }}
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
                  <Avatar
                    path={myProfile.avatar}
                    name={myProfile.github_username}
                    size="medium"
                  />
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
                  onClick={() => setShowTxModal(true)}
                >
                  Recent Transactions
                </Link>
              )}
              <Link
                type="menu"
                css={{ fontSize: '$xs', color: '$headingText' }}
                onClick={logout}
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
            </Box>
          </PopoverContent>
        </Popover>
      </Hidden>
    </>
  );
};
