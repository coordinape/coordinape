import { useRef, useState } from 'react';

import { NavLink } from 'react-router-dom';

import { makeStyles, Hidden } from '@material-ui/core';

import { ApeAvatar } from 'components';
import { menuGroupStyle } from 'components/MainLayout/MainHeader';
import isFeatureEnabled from 'config/features';
import { useWalletStatus } from 'hooks/login';
import { useMyProfile } from 'recoilState/app';
import { EXTERNAL_URL_DOCS, paths } from 'routes/paths';
import {
  Box,
  Link,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverClose,
} from 'ui';
import { shortenAddress } from 'utils';

import { RecentTransactionsModal } from './RecentTransactionsModal';

const useStyles = makeStyles(theme => ({
  avatarButton: {
    marginLeft: theme.spacing(1.5),
    height: '50px',
    width: '50px',
    cursor: 'pointer',
  },
}));

export const MyAvatarMenu = () => {
  const classes = useStyles();
  const myProfile = useMyProfile();
  const { icon, address, logout } = useWalletStatus();
  const [showTxModal, setShowTxModal] = useState(false);

  const [mouseEnterPopover, setMouseEnterPopover] = useState(false);
  const [mouseEnterTrigger, setMouseEnterTrigger] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const closePopover = () => {
    setMouseEnterPopover(false);
  };

  return (
    <>
      {showTxModal && (
        <RecentTransactionsModal onClose={() => setShowTxModal(false)} />
      )}
      <Hidden smDown>
        <Popover open={mouseEnterPopover || mouseEnterTrigger}>
          <PopoverTrigger
            css={{ outline: 'none' }}
            asChild
            ref={triggerRef}
            onMouseEnter={() => setMouseEnterTrigger(true)}
            onMouseLeave={() =>
              setTimeout(() => setMouseEnterTrigger(false), 200)
            }
          >
            <Link href="#">
              <ApeAvatar profile={myProfile} className={classes.avatarButton} />
            </Link>
          </PopoverTrigger>
          <PopoverContent
            onMouseEnter={() => setMouseEnterPopover(true)}
            onMouseLeave={() =>
              setTimeout(() => setMouseEnterPopover(false), 200)
            }
            // These offset values must be dialed in browser.  CSS values/strings cannot be used, only numbers.
            sideOffset={-66}
            alignOffset={-16}
            css={{ background: '$surface', outline: 'none' }}
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
                  <ApeAvatar
                    className={classes.avatarButton}
                    profile={myProfile}
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
              </Box>
              <Box css={menuGroupStyle}>
                <Link type="menu" href={EXTERNAL_URL_DOCS}>
                  Docs
                </Link>
                <Link
                  type="menu"
                  href="https://notionforms.io/forms/give-us-your-feedback-improve-coordinape"
                  target="_blank"
                >
                  Give Feedback
                </Link>
              </Box>
            </Box>
          </PopoverContent>
        </Popover>
      </Hidden>
    </>
  );
};
