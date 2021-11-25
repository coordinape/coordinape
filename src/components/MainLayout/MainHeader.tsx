import { Suspense } from 'react';

import { NavLink } from 'react-router-dom';

import { makeStyles, useMediaQuery, useTheme } from '@material-ui/core';

import { WalletButton, ReceiveInfo, MyAvatarMenu } from 'components';
import { useSelectedCircle } from 'recoilState/app';
import { getMainNavigation, checkActive } from 'routes/paths';

const useStyles = makeStyles(theme => ({
  root: {
    height: theme.custom.appHeaderHeight,
    display: 'grid',
    alignItems: 'center',
    background: theme.colors.primary,
    gridTemplateColumns: '1fr 1fr 1fr',
    padding: theme.spacing(0, 5),
    '& > *': {
      alignSelf: 'center',
    },
    '& .MuiSkeleton-root': {
      marginLeft: theme.spacing(1.5),
    },
    '& .MuiSkeleton-rect': {
      borderRadius: 5,
    },
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(0, 2, 4),
      height: theme.custom.appHeaderHeight + 32,
      gridTemplateColumns: '1fr 8fr',
      zIndex: 2,
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
    [theme.breakpoints.down('sm')]: {
      justifySelf: 'end',
    },
  },
  navLinks: {
    justifySelf: 'stretch',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-end',
    [theme.breakpoints.down('sm')]: {
      position: 'absolute',
      width: '100%',
      background: theme.colors.primary,
      top: theme.custom.appHeaderHeight - 12,
      left: '0px',
    },
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

export const MainHeader = () => {
  const theme = useTheme();
  const classes = useStyles();
  const screenDownSm = useMediaQuery(theme.breakpoints.down('sm'));
  // TODO: Implment a hamburger menu
  // const screenDownXs = useMediaQuery(theme.breakpoints.down('xs'));

  return (
    <div className={classes.root}>
      <img
        alt="logo"
        className={classes.coordinapeLogo}
        src="/svgs/logo/logo.svg"
      />
      {screenDownSm ? (
        <div className={classes.smallNavAndButtons}>
          <div className={classes.buttons}>
            <Suspense fallback={<></>}>
              <ReceiveInfo />
            </Suspense>
            <WalletButton />
            <Suspense fallback={<></>}>
              <MyAvatarMenu />
            </Suspense>
          </div>
          <Suspense fallback={<></>}>
            <HeaderNav />
          </Suspense>
        </div>
      ) : (
        <>
          <Suspense fallback={<span />}>
            <HeaderNav />
          </Suspense>
          <div className={classes.buttons}>
            <Suspense fallback={<></>}>
              <ReceiveInfo />
            </Suspense>
            <WalletButton />
            <Suspense fallback={<></>}>
              <MyAvatarMenu />
            </Suspense>
          </div>
        </>
      )}
    </div>
  );
};

export const HeaderNav = () => {
  const classes = useStyles();
  const { circle, myUser } = useSelectedCircle();

  const navItems = getMainNavigation({
    asCircleAdmin: myUser.isCircleAdmin,
    asVouchingEnabled: circle.hasVouching,
  });

  return (
    <div className={classes.navLinks}>
      {navItems.map(navItem => (
        <NavLink
          className={classes.navLink}
          isActive={(nothing, location) =>
            checkActive(location.pathname, navItem)
          }
          key={navItem.path}
          to={navItem.path}
        >
          {navItem.label}
        </NavLink>
      ))}
    </div>
  );
};

export default MainHeader;
