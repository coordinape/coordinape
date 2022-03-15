import { Suspense, useState, useEffect } from 'react';

import { useLocation, NavLink } from 'react-router-dom';
import { useRecoilValueLoadable } from 'recoil';
import { MediaQueryKeys } from 'stitches.config';

import {
  ReceiveInfo,
  MyAvatarMenu,
  MenuNavigationLinks,
  WalletButton,
} from 'components';
import { useMediaQuery } from 'hooks';
import { HamburgerIcon, CloseIcon } from 'icons';
import {
  rSelectedCircle,
  useSelectedCircle,
  useWalletAuth,
} from 'recoilState/app';
import { useHasCircles } from 'recoilState/db';
import { getMainNavigation, paths } from 'routes/paths';
import { Box, IconButton, Link, Image, Divider } from 'ui';

export const MainHeader = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { address } = useWalletAuth();
  const hasCircles = useHasCircles();
  const selectedCircle = useRecoilValueLoadable(rSelectedCircle).valueMaybe();
  const breadcrumb = `${selectedCircle?.circle.protocol.name} > ${selectedCircle?.circle.name}`;

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  useEffect(() => {
    !address && setIsMobileMenuOpen(false);
  }, [address]);

  const screenDownSm = useMediaQuery(MediaQueryKeys.sm);

  const menuWalletButton = !address ? (
    <WalletButton />
  ) : (
    <IconButton
      onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      aria-label="menu"
      variant="ghost"
    >
      {!isMobileMenuOpen ? (
        <HamburgerIcon color="white" />
      ) : (
        <CloseIcon color="white" />
      )}
    </IconButton>
  );

  return !screenDownSm ? (
    <Box
      css={{
        display: 'grid',
        alignItems: 'center',
        background: '$primary',
        gridTemplateColumns: '1fr 1fr 1fr',
        py: '$md',
        px: '$1xl',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
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
        {hasCircles && (
          <Suspense fallback={<span />}>
            <CircleNav /> <div style={{ color: '#B5BBBD' }}>{breadcrumb}</div>
          </Suspense>
        )}
      </div>
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
    <Box>
      <Box
        css={{
          display: 'flex',
          alignItems: 'center',
          background: '$primary',
          justifyContent: 'space-between',
          px: '$lg',
          py: '$md',
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
            backgroundColor: '$surfaceGray',
          }}
        >
          <Box
            css={{
              display: 'flex',
              flexDirection: 'column',
              position: 'absolute',
              backgroundColor: '$surfaceGray',
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
                <CircleNav />
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
          </Box>
        </Box>
      )}
    </Box>
  );
};

const linkStyle = {
  my: 0,
  mx: '$md',
  fontSize: '$6',
  fontWeight: '$bold',
  color: '$white',
  textDecoration: 'none',
  px: 0,
  py: '$xs',
  position: 'relative',
  '&::after': {
    content: `" "`,
    position: 'absolute',
    left: '50%',
    right: '50%',
    backgroundColor: '$mediumRed',
    transition: 'all 0.3s',
    bottom: 0,
    height: 2,
  },
  '&:hover': {
    '&::after': {
      left: 0,
      right: 0,
      backgroundColor: '$mediumRed',
    },
  },
  '&.active': {
    '&::after': {
      left: 0,
      right: 0,
      backgroundColor: '$red',
    },
    '&:hover': {
      '&::after': {
        left: 0,
        right: 0,
        backgroundColor: '$red',
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
      color: '$red',
      '&::after': {
        content: 'none',
      },
    },
  },
};

const boxStyle = {
  justifySelf: 'stretch',
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
  '@sm': {
    alignItems: 'flex-start',
    flexDirection: 'column',
  },
};

export const CircleNav = () => {
  const circleNavItems = [{ path: paths.circles, label: 'Circles' }];

  return (
    <Box css={boxStyle}>
      {circleNavItems.map(navItem => (
        <Link css={linkStyle} as={NavLink} key={navItem.path} to={navItem.path}>
          {navItem.label}
        </Link>
      ))}
    </Box>
  );
};

export const HeaderNav = () => {
  const { circle, myUser } = useSelectedCircle();
  const navItems = getMainNavigation({
    asCircleAdmin: myUser.isCircleAdmin,
    asVouchingEnabled: circle.hasVouching,
  });

  return (
    <Box css={boxStyle}>
      {navItems.map(navItem => (
        <Link css={linkStyle} as={NavLink} key={navItem.path} to={navItem.path}>
          {navItem.label}
        </Link>
      ))}
    </Box>
  );
};

export default MainHeader;
