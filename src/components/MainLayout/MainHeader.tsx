import { Suspense, useState, useEffect } from 'react';

import { NavLink, useLocation } from 'react-router-dom';

import { useMediaQuery, useTheme } from '@material-ui/core';

import { CSS } from '../../stitches.config';
import { Box, Button, Link, Image, Divider } from '../../ui';
import {
  ReceiveInfo,
  MyAvatarMenu,
  MenuNavigationLinks,
  CirclesHeaderSection,
  WalletButton,
} from 'components';
import { CirclesSelectorSection } from 'components/MyAvatarMenu/MyAvatarMenu';
import { HamburgerIcon, CloseIcon } from 'icons';
import {
  useMyProfileLoadable,
  useSelectedCircle,
  useWalletAuth,
} from 'recoilState/app';
import { getMainNavigation, checkActive } from 'routes/paths';

const cssNavLink: CSS = {
  my: 0,
  mx: '$md',
  fontSize: '$5plus1px',
  fontWeight: '$bold',
  color: '$white',
  textDecoration: 'none',
  py: '$1sm',
  px: 0,
  position: 'relative',
  '&::after': {
    content: `" "`,
    position: 'absolute',
    left: '50%',
    right: '50%',
    backgroundColor: '$red300',
    transition: 'all 0.3s',
    bottom: 0,
    height: '$2xs',
  },
  '&:hover': {
    '&::after': {
      left: 0,
      right: 0,
      backgroundColor: '$red300',
    },
  },
  '&.active': {
    '&::after': {
      left: 0,
      right: 0,
      backgroundColor: '$red400',
    },
    '&:hover': {
      '&::after': {
        left: 0,
        right: 0,
        backgroundColor: '$red400',
      },
    },
  },
  '@sm': {
    position: 'unset',
    color: '$text',
    fontWeight: 'normal',
    '&:hover': {
      color: '$black',
      '&::after': {
        content: 'none',
      },
    },
    '&.active': {
      color: '$red400',
      '&::after': {
        content: 'none',
      },
    },
  },
};

export const MainHeader = () => {
  const theme = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { address } = useWalletAuth();
  const myProfile = useMyProfileLoadable();
  const valueProfile = myProfile.valueMaybe();

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  useEffect(() => {
    !address && setIsMobileMenuOpen(false);
  }, [address]);

  const screenDownSm = useMediaQuery(theme.breakpoints.down('sm'));

  const menuWalletButton = !address ? (
    <WalletButton />
  ) : (
    <Button
      onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      size="small"
      aria-label="menu"
      type="icon"
    >
      {!isMobileMenuOpen ? <HamburgerIcon /> : <CloseIcon />}
    </Button>
  );

  return !screenDownSm ? (
    <Box
      css={{
        height: '$5xl',
        display: 'grid',
        alignItems: 'center',
        background: '$primary',
        gridTemplateColumns: '1fr 1fr 1fr',
        py: 0,
        px: '$1xl',
        '@sm': {
          display: 'flex',
          justifyContent: 'space-between',
          py: 0,
          px: '$lg',
          height: '$4xl',
        },
      }}
    >
      <Image
        alt="logo"
        css={{
          justifySelf: 'start',
          height: '$1xl',
        }}
        src="/svgs/logo/logo.svg"
      />
      <Suspense fallback={<span />}>
        <HeaderNav />
      </Suspense>
      <Box
        css={{
          justifySelf: 'end',
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
        }}
      >
        <Suspense fallback={<span />}>
          <ReceiveInfo />
        </Suspense>
        <WalletButton />
        <Suspense fallback={<span />}>
          <MyAvatarMenu />
        </Suspense>
      </Box>
    </Box>
  ) : (
    <div>
      <Box
        css={{
          display: 'flex',
          alignItems: 'center',
          background: '$primary',
          justifyContent: 'space-between',
          px: '$lg',
          height: '$4xl',
        }}
      >
        <Image
          alt="logo"
          css={{
            justifySelf: 'start',
            height: 40,
          }}
          src="/svgs/logo/logo.svg"
        />
        {menuWalletButton}
      </Box>
      {isMobileMenuOpen && (
        <Box
          css={{
            height: '100vh',
            position: 'relative',
            backgroundColor: '$gray',
          }}
        >
          <Box
            css={{
              display: 'flex',
              flexDirection: 'column',
              position: 'absolute',
              backgroundColor: '$gray',
              height: '85%',
              width: '100%',
              overflow: 'scroll',
              overscrollBehaviorY: 'auto',
              '-webkit-overflow-scrolling': 'touch',
              zIndex: 2,
              pt: '$lg',
              px: '$sm',
              pb: '$2xl',
            }}
          >
            <Box
              css={{
                pb: '$md',
              }}
            >
              <Suspense fallback={<span />}>
                <HeaderNav />
              </Suspense>
            </Box>
            <Divider />
            <Box css={{ pt: '$lg' }} />
            <Box
              css={{
                display: 'flex',
                alignItems: 'center',
                gap: '$sm',
              }}
            >
              <Suspense fallback={null}>
                <Box>
                  <MyAvatarMenu />
                </Box>
              </Suspense>
              <Box>
                <WalletButton />
                {/* TODO: ask Alexander where the GIVES needs to be 
              <Suspense fallback={<span />}>
                <ReceiveInfo />
              </Suspense>*/}
              </Box>
            </Box>
            <Box
              css={{
                display: 'flex',
                flexDirection: 'column',
                px: '$md',
                py: '$lg',
              }}
            >
              <MenuNavigationLinks />
            </Box>
            <Divider />
            <Box
              css={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                px: '$md',
                py: '$md',
              }}
            >
              <Suspense fallback={null}>
                <CirclesHeaderSection
                  handleOnClick={() => setIsMobileMenuOpen(false)}
                />
              </Suspense>
            </Box>
            {valueProfile?.hasAdminView && (
              <>
                <Divider />
                <Box
                  css={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    px: '$md',
                    py: '$md',
                  }}
                >
                  <CirclesSelectorSection
                    handleOnClick={() => setIsMobileMenuOpen(false)}
                  />
                </Box>
              </>
            )}
          </Box>
        </Box>
      )}
    </div>
  );
};

export const HeaderNav = () => {
  const { circle, myUser } = useSelectedCircle();

  const navItems = getMainNavigation({
    asCircleAdmin: myUser.isCircleAdmin,
    asVouchingEnabled: circle.hasVouching,
  });

  return (
    <Box
      css={{
        justifySelf: 'stretch',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-end',
        '@sm': {
          alignItems: 'flex-start',
          flexDirection: 'column',
        },
      }}
    >
      {navItems.map(navItem => (
        <Link
          css={cssNavLink}
          as={NavLink}
          isActive={(nothing: any, location: { pathname: string }) =>
            checkActive(location.pathname, navItem)
          }
          key={navItem.path}
          to={navItem.path}
        >
          {navItem.label}
        </Link>
      ))}
    </Box>
  );
};

export default MainHeader;
