import { Suspense, useState, useEffect } from 'react';

import { NavLink, useLocation } from 'react-router-dom';

import {
  makeStyles,
  useMediaQuery,
  useTheme,
  Box,
  IconButton,
  Divider,
  Grid,
} from '@material-ui/core';

import {
  ReceiveInfo,
  MyAvatarMenu,
  MenuNavigationLinks,
  CirclesHeaderSection,
  WalletButton,
} from 'components';
import { CloseIcon, HamburgerIcon } from 'icons';
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
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: theme.spacing(0, '25px'),
      height: theme.custom.appHeaderHeight - 11,
      position: 'relative',
      zIndex: 2,
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
  mobileMenu: {
    top: theme.custom.appHeaderHeight - 11,
    left: 0,
    position: 'absolute',
    backgroundColor: theme.colors.ultraLightGray,
    width: '100%',
    height: '95vh',
    overflowY: 'scroll',
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
      alignItems: 'flex-start',
      flexDirection: 'column',
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
    [theme.breakpoints.down('sm')]: {
      position: 'unset',
      color: theme.colors.text,
      fontWeight: 'normal',
      '&:hover': {
        color: theme.colors.black,
      },
      '&.active': {
        color: theme.colors.red,
      },
    },
  },
  editCircleButton: {
    backgroundColor: theme.colors.red,
    borderRadius: '8px',
    width: '32px',
    height: '32px',
  },
  accountInfoMobile: {
    '& .MuiButtonBase-root': {
      background: theme.colors.white,
    },
  },
  editIcon: {
    color: theme.colors.white,
  },
  profileHeading: {
    color: theme.colors.red,
  },
}));

export const MainHeader = () => {
  const theme = useTheme();
  const classes = useStyles();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  // const screenDownSm = useMediaQuery(theme.breakpoints.down('sm'));
  const screenDownSm = useMediaQuery(theme.breakpoints.down('sm'));

  return !screenDownSm ? (
    <div className={classes.root}>
      <img
        alt="logo"
        className={classes.coordinapeLogo}
        src="/svgs/logo/logo.svg"
      />
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
      {/* {screenDownSm ? (
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
      )} */}
    </div>
  ) : (
    <div className={classes.root}>
      <img
        alt="logo"
        className={classes.coordinapeLogo}
        src="/svgs/logo/logo.svg"
      />
      <IconButton
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        size="small"
        aria-label="menu"
      >
        {!isMobileMenuOpen ? <HamburgerIcon /> : <CloseIcon />}
      </IconButton>
      {isMobileMenuOpen && (
        <Box
          display="flex"
          className={classes.mobileMenu}
          flexDirection="column"
          py={3}
          px={1}
        >
          <Box
            px={2}
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
          >
            <CirclesHeaderSection
              handleOnClick={() => setIsMobileMenuOpen(false)}
            />
          </Box>
          <Divider variant="fullWidth" />
          <Box py={2}>
            <Suspense fallback={<span />}>
              <HeaderNav />
            </Suspense>
          </Box>
          <Divider variant="fullWidth" />
          <Box pt={3} />
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <MyAvatarMenu />
            </Grid>
            <Grid className={classes.accountInfoMobile} item>
              <WalletButton />
            </Grid>
          </Grid>
          <Box py={3} display="flex" flexDirection="column" px={2}>
            <MenuNavigationLinks />
          </Box>
        </Box>
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
