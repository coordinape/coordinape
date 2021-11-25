import { Suspense, useState, useEffect } from 'react';

import clsx from 'clsx';
import { NavLink, useLocation } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

import {
  makeStyles,
  useMediaQuery,
  useTheme,
  Box,
  IconButton,
  Divider,
  Grid,
  ButtonBase,
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import { Skeleton } from '@material-ui/lab';

import {
  AccountInfo,
  ConnectWalletButton,
  ReceiveInfo,
  MyAvatarMenu,
  MenuNavigationLinks,
} from 'components';
import { useSelectedCircleEpoch, useMe, useCircle } from 'hooks';
import { CloseIcon, HamburgerIcon } from 'icons';
import { rMyAddress } from 'recoilState';
import { getMainNavigation, checkActive } from 'routes/paths';

const useStyles = makeStyles(theme => ({
  root: {
    height: theme.custom.appHeaderHeight,
    display: 'grid',
    alignItems: 'center',
    background: theme.colors.primary,
    gridTemplateColumns: '1fr 1fr 1fr',
    padding: theme.spacing(0, 5),
    [theme.breakpoints.down('xs')]: {
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
    height: '100vh',
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
    [theme.breakpoints.down('xs')]: {
      justifySelf: 'end',
    },
  },
  navLinks: {
    justifySelf: 'stretch',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-end',
    [theme.breakpoints.down('xs')]: {
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
    [theme.breakpoints.down('xs')]: {
      color: theme.colors.text,
      fontWeight: 'normal',
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
  mobileCircleHeading: {
    fontSize: '24px',
    fontStyle: 'normal',
    fontWeight: 700,
    lineHeight: '30px',
    color: theme.colors.text,
  },
  profileHeading: {
    color: theme.colors.red,
  },
}));

export const HeaderNav = () => {
  const classes = useStyles();
  const { selectedCircle } = useCircle();
  const { selectedMyUser, hasAdminView } = useMe();

  const navButtonsVisible = !!selectedMyUser || hasAdminView;
  const navItems = getMainNavigation({
    asCircleAdmin: selectedMyUser && selectedMyUser.role !== 0,
    asVouchingEnabled: selectedCircle && selectedCircle.vouching !== 0,
  });
  return (
    <div className={classes.navLinks}>
      {navButtonsVisible &&
        navItems.map(navItem => (
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

export const MainHeader = () => {
  const theme = useTheme();
  const classes = useStyles();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

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
          <Box px={2} display="flex" justifyContent="space-between">
            <div className={classes.mobileCircleHeading}>Year Finance</div>
            <ButtonBase className={classes.editCircleButton}>
              <EditIcon className={classes.editIcon} />
            </ButtonBase>
          </Box>
          <NavLink
            isActive={() => false}
            className={clsx(classes.navLink, classes.profileHeading)}
            to="/"
          >
            Community Grants
          </NavLink>
          <NavLink isActive={() => false} className={classes.navLink} to="/">
            Core Contributors
          </NavLink>
          <Divider variant="fullWidth" />
          <Box py={2}>{suspendedNav}</Box>
          <Divider variant="fullWidth" />
          <Box pt={3} />
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <MyAvatarMenu />
            </Grid>
            <Grid className={classes.accountInfoMobile} item>
              <AccountInfo />
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

export default MainHeader;
