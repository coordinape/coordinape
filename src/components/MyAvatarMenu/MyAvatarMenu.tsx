import React from 'react';

import { useWeb3React } from '@web3-react/core';
import clsx from 'clsx';

import { Popover, makeStyles, Hidden } from '@material-ui/core';

import { ReactComponent as CoinbaseSVG } from 'assets/svgs/wallet/coinbase.svg';
import { ReactComponent as MetaMaskSVG } from 'assets/svgs/wallet/metamask-color.svg';
import { ReactComponent as WalletConnectSVG } from 'assets/svgs/wallet/wallet-connect.svg';
import { ApeAvatar } from 'components';
import { EConnectorNames } from 'config/constants';
import { useApiBase } from 'hooks';
import { useMyProfile } from 'recoilState/app';
import { EXTERNAL_URL_DOCS, paths } from 'routes/paths';
import { AppLink, Box, Link } from 'ui';
import { shortenAddress } from 'utils';
import { connectors } from 'utils/connectors';

const useStyles = makeStyles(theme => ({
  avatarButton: {
    marginLeft: theme.spacing(1.5),
    height: '50px',
    width: '50px',
    cursor: 'pointer',
    border: '3px solid #828F93',
    transition: 'border-color .3s ease',
    '&.selected': {
      border: '3px solid rgba(239, 115, 118, 1)',
    },
    '&:hover': {
      border: '3px solid rgba(239, 115, 118, 1)',
    },
  },
  popover: {
    width: 237,
    marginTop: theme.spacing(0.5),
    padding: 0,
    borderRadius: 8,
    background:
      'linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(223, 237, 234, 0.4) 40.1%), linear-gradient(180deg, rgba(237, 253, 254, 0.4) 0%, rgba(207, 231, 233, 0) 100%), #FFFFFF',
    boxShadow: '0px 4px 6px rgba(181, 193, 199, 0.16)',
    display: 'flex',
    flexDirection: 'column',
  },
}));

export const MyAvatarMenu = () => {
  const classes = useStyles();
  const myProfile = useMyProfile();
  const { icon, address, logout } = useWalletStatus();

  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  return (
    <>
      <ApeAvatar
        profile={myProfile}
        onClick={event => setAnchorEl(event.currentTarget)}
        className={
          !anchorEl
            ? classes.avatarButton
            : clsx(classes.avatarButton, 'selected')
        }
      />
      <Hidden smDown>
        <Popover
          anchorEl={anchorEl}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          classes={{ paper: classes.popover }}
          id="my-avatar-popover"
          onClick={() => setTimeout(() => setAnchorEl(null))}
          onClose={() => setAnchorEl(null)}
          open={!!anchorEl}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Box
            css={{
              display: 'flex',
              flexDirection: 'column',
              pt: '$md',
              '> *': { padding: '$xs $lg' },
              '> a': {
                color: '$primary',
                '&:hover': { color: '$black' },
              },
            }}
          >
            <Box css={{ display: 'flex', alignItems: 'center' }}>
              <Box css={{ mr: '$sm', display: 'flex' }}>{icon}</Box>
              {address && shortenAddress(address)}
            </Box>

            <AppLink to={paths.profile('me')}>My Profile</AppLink>
            <AppLink to={paths.circles}>My Circles</AppLink>
            <Link href={EXTERNAL_URL_DOCS}>Docs</Link>
            <Link css={{ cursor: 'pointer' }} onClick={logout}>
              Log Out
            </Link>
            <Link
              css={{
                backgroundColor: '$darkTeal',
                mt: '$md',
                py: '$md !important',
                color: 'white !important',
                '&:hover': { opacity: 0.8 },
              }}
              href="https://notionforms.io/forms/give-us-your-feedback-improve-coordinape"
              target="_blank"
            >
              Give Feedback
            </Link>
          </Box>
        </Popover>
      </Hidden>
    </>
  );
};

type Connector = Exclude<
  ReturnType<typeof useWeb3React>['connector'],
  undefined
>;

const connectorIcon = (connector: Connector | undefined) => {
  if (!connector) return null;

  const name = Object.entries(connectors).find(
    ([, ctr]) => connector.constructor === ctr.constructor
  )?.[0];

  switch (name) {
    case EConnectorNames.Injected:
      return <MetaMaskSVG />;
    case EConnectorNames.WalletConnect:
      return <WalletConnectSVG />;
    case EConnectorNames.WalletLink:
      return <CoinbaseSVG />;
  }
  return null;
};

export const useWalletStatus = () => {
  const { connector, account, deactivate } = useWeb3React();
  const { logout } = useApiBase();

  return {
    icon: connectorIcon(connector),
    address: account,
    logout: () => {
      deactivate();
      logout();
    },
  };

  // return (
  //   <>
  //     <Box css={{ display: 'flex', alignItems: 'center' }}>
  //       <Box css={{ mr: '$sm', display: 'flex' }}>
  //         {connectorIcon(connector)}
  //       </Box>
  //       {account && shortenAddress(account)}
  //     </Box>
  //     {account && (
  //       <Link css={{ cursor: 'pointer' }} onClick={disconnect}>
  //         Log Out
  //       </Link>
  //     )}
  //   </>
  // );
};
