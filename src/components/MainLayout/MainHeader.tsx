import { Suspense, useState, useEffect } from 'react';

import { useLocation, NavLink } from 'react-router-dom';
import { MediaQueryKeys } from 'stitches.config';

import {
  ReceiveInfo,
  MyAvatarMenu,
  MenuNavigationLinks,
  CirclesHeaderSection,
  WalletButton,
  CirclesSelectorSection,
} from 'components';
import { useMediaQuery } from 'hooks';
import { HamburgerIcon, CloseIcon } from 'icons';
import {
  useMyProfileLoadable,
  useSelectedCircle,
  useWalletAuth,
} from 'recoilState/app';
import { getMainNavigation } from 'routes/paths';
import { Box, IconButton, Link, Image, Divider } from 'ui';

export const MainHeader = () => {
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
          css={{
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
          }}
          as={NavLink}
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
