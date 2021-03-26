import { makeStyles } from '@material-ui/core';
import { AccountInfo, ConnectWalletButton, ReceiveInfo } from 'components';
import { STORAGE_KEY_CONNECTOR } from 'config/constants';
import { useConnectedWeb3Context, useGlobal, useUserInfo } from 'contexts';
import { transparentize } from 'polished';
import React from 'react';
import { matchPath, useHistory } from 'react-router';
import { NavLink } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    height: theme.custom.appHeaderHeight,
    display: 'flex',
    justifyContent: 'space-between',
    padding: `0 ${theme.spacing(6)}px`,
    alignItems: 'center',
    background: theme.colors.primary,
    boxShadow: `0px 1px 2px ${transparentize(0.9, theme.colors.black)}`,
    position: 'fixed',
    left: 0,
    right: 0,
    top: 0,
    [theme.breakpoints.down('xs')]: {
      padding: `0 ${theme.spacing(2)}px`,
    },
    zIndex: 1,
  },
  img: {
    height: 58,
  },
  buttons: {},
  info: {
    display: 'flex',
  },
  navLink: {
    margin: `0 ${theme.spacing(4)}px`,
    fontSize: 20,
    fontWeight: 700,
    color: theme.colors.white,
    textDecoration: 'none',
    padding: '6px 0',
    position: 'relative',
    '&::after': {
      content: `" "`,
      position: 'absolute',
      left: '50%',
      right: '50%',
      backgroundColor: theme.colors.mediumRed,
      transition: 'all 0.3s',
      bottom: 0,
      height: 2,
    },
    '&:hover': {
      '&::after': {
        left: 0,
        right: 0,
        backgroundColor: theme.colors.mediumRed,
      },
    },
    '&.active': {
      '&::after': {
        left: 0,
        right: 0,
        backgroundColor: theme.colors.red,
      },
      '&:hover': {
        '&::after': {
          left: 0,
          right: 0,
          backgroundColor: theme.colors.red,
        },
      },
    },
  },
}));

const navButtonsInfo = [
  { path: '/team', label: 'Edit Team' },
  { path: '/allocation', label: 'Allocation' },
  { path: '/map', label: 'Graph' },
  { path: '/history', label: 'History' },
];

interface IProps {
  className?: string;
}

export const Header = (props: IProps) => {
  const classes = useStyles();
  const { account, rawWeb3Context } = useConnectedWeb3Context();
  const { toggleWalletConnectModal } = useGlobal();
  const connector = localStorage.getItem(STORAGE_KEY_CONNECTOR);
  const { me } = useUserInfo();
  const history = useHistory();

  const navButtonsVisible = navButtonsInfo
    .map((nav) => nav.path)
    .map(
      (path) => !!matchPath(history.location.pathname, { exact: true, path })
    )
    .reduce((s, e) => s || e);

  const onDisconnect = () => {
    rawWeb3Context.deactivate();
    localStorage.removeItem(STORAGE_KEY_CONNECTOR);
  };

  return (
    <div className={classes.root}>
      <img
        alt="logo"
        className={classes.img}
        src="/svgs/logo/coordinape_logo.svg"
      />
      {navButtonsVisible && (
        <div>
          {navButtonsInfo.map((nav) => (
            <NavLink
              className={classes.navLink}
              isActive={() =>
                !!matchPath(history.location.pathname, {
                  exact: true,
                  path: nav.path,
                })
              }
              key={nav.path}
              to={nav.path}
            >
              {nav.label}
            </NavLink>
          ))}
        </div>
      )}
      <div className={classes.buttons}>
        {!account ? (
          <ConnectWalletButton onClick={toggleWalletConnectModal} />
        ) : (
          <div className={classes.info}>
            {me ? <ReceiveInfo /> : ''}
            <AccountInfo
              address={account}
              icon={connector || ''}
              onDisconnect={onDisconnect}
            />
          </div>
        )}
      </div>
    </div>
  );
};
