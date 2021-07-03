import React, { Suspense } from 'react';

import { matchPath, useHistory } from 'react-router';
import { NavLink } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

import { makeStyles, useMediaQuery, useTheme } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';

import {
  AccountInfo,
  ConnectWalletButton,
  ReceiveInfo,
  MyAvatarMenu,
} from 'components';
import { useSelectedCircleEpoch, useMe } from 'hooks';
import { rMyAddress } from 'recoilState';
import { getMainNavigation } from 'routes/paths';

const useStyles = makeStyles((theme) => ({
  root: {
    height: theme.custom.appHeaderHeight,
    display: 'grid',
    alignItems: 'center',
    background: theme.colors.primary,
    gridTemplateColumns: '1fr 1fr 1fr',
    padding: theme.spacing(0, 4),
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(0, 2),
      gridTemplateColumns: '1fr 8fr 1fr',
    },
    '& > *': {
      alignSelf: 'center',
    },
    '& .MuiSkeleton-root': {
      marginLeft: theme.spacing(1.5),
    },
    '& .MuiSkeleton-rect': {
      borderRadius: 5,
    },
  },
  coordinapeLogo: {
    justifySelf: 'start',
    height: 40,
  },
  smallNavAndButtons: {
    justifySelf: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  navLinks: {
    justifySelf: 'stretch',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  buttons: {
    justifySelf: 'end',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  navLink: {
    margin: theme.spacing(0, 2),
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

export const HeaderNav = () => {
  const classes = useStyles();
  const history = useHistory();
  const { selectedMyUser, hasAdminView } = useMe();

  const navButtonsVisible = !!selectedMyUser || hasAdminView;

  const navItems = getMainNavigation({
    asCircleAdmin: selectedMyUser && selectedMyUser.role !== 0,
  });
  return (
    <div className={classes.navLinks}>
      {navButtonsVisible
        ? navItems.map(({ path, label }) => (
            <NavLink
              className={classes.navLink}
              isActive={() =>
                !!matchPath(history.location.pathname, {
                  exact: true,
                  path: path,
                })
              }
              key={path}
              to={path}
            >
              {label}
            </NavLink>
          ))
        : null}
    </div>
  );
};

export const HeaderButtons = () => {
  const classes = useStyles();

  const myAddress = useRecoilValue(rMyAddress);
  const { epochIsActive } = useSelectedCircleEpoch();

  return !myAddress ? (
    <div className={classes.buttons}>
      <ConnectWalletButton />
    </div>
  ) : (
    <div className={classes.buttons}>
      {epochIsActive ? <ReceiveInfo /> : ''}
      <AccountInfo />
      <MyAvatarMenu />
    </div>
  );
};

export const MainHeader = ({ className }: { className?: string }) => {
  const theme = useTheme();
  const classes = useStyles();

  const screenDownXs = useMediaQuery(theme.breakpoints.down('xs'));

  const suspendedNav = (
    <Suspense
      fallback={
        <div className={classes.navLinks}>
          <Skeleton width={100} height={20} />
          <Skeleton width={100} height={20} />
        </div>
      }
    >
      <HeaderNav />
    </Suspense>
  );

  const suspendedButtons = (
    <Suspense
      fallback={
        <div className={classes.buttons}>
          <Skeleton variant="rect" width={80} height={32} />
          <Skeleton variant="rect" width={130} height={32} />
          <Skeleton variant="circle" width={50} height={50} />
        </div>
      }
    >
      <HeaderButtons />
    </Suspense>
  );

  return !screenDownXs ? (
    <div className={classes.root}>
      <img
        alt="logo"
        className={classes.coordinapeLogo}
        src="/svgs/logo/logo.svg"
      />
      {suspendedNav}
      {suspendedButtons}
    </div>
  ) : (
    <div className={classes.root}>
      <img
        alt="logo"
        className={classes.coordinapeLogo}
        src="/svgs/logo/logo.svg"
      />
      <div className={classes.smallNavAndButtons}>
        {suspendedButtons}
        {suspendedNav}
      </div>
    </div>
  );
};

export default MainHeader;
