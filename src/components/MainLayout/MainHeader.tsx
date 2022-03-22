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
import isFeatureEnabled from 'config/features';
import { useMediaQuery } from 'hooks';
import { HamburgerIcon, CloseIcon } from 'icons';
import {
  rSelectedCircle,
  useSelectedCircle,
  useWalletAuth,
} from 'recoilState/app';
import { useHasCircles } from 'recoilState/db';
import { getMainNavigation, paths } from 'routes/paths';
import type { INavItem } from 'routes/paths';
import { Box, IconButton, Link, Image, Divider } from 'ui';

const mainLinks = [
  { path: paths.circles, label: 'Circles' },
  isFeatureEnabled('vaults') && { path: paths.vaults, label: 'Vaults' },
].filter(x => x) as INavItem[];

export const MainHeader = () => {
  const hasCircles = useHasCircles();
  const { circle } = useRecoilValueLoadable(rSelectedCircle).valueMaybe() || {};
  const breadcrumb = circle ? `${circle.protocol.name} > ${circle.name}` : '';

  if (useMediaQuery(MediaQueryKeys.sm))
    return <MobileHeader breadcrumb={breadcrumb} />;

  return (
    <Box
      css={{
        px: '$1xl',
        height: '82px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: '$primary',
      }}
    >
      <Image
        alt="logo"
        css={{
          justifySelf: 'start',
          height: '$1xl',
          mr: '$md',
        }}
        src="/svgs/logo/logo.svg"
      />
      {hasCircles && (
        <Suspense fallback={null}>
          <TopLevelLinks links={mainLinks} />
          <Box css={{ color: '$gray400', ml: '$md', flex: '1 1 0' }}>
            {breadcrumb}
          </Box>
        </Suspense>
      )}
      <Box
        css={{ display: 'flex', justifySelf: 'flex-end', alignItems: 'center' }}
      >
        <Suspense fallback={null}>
          <CircleNav />
          <ReceiveInfo />
        </Suspense>
        <WalletButton />
        <Suspense fallback={null}>
          <MyAvatarMenu />
        </Suspense>
      </Box>
    </Box>
  );
};

const MobileHeader = ({ breadcrumb }: { breadcrumb: string }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { address } = useWalletAuth();

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  useEffect(() => {
    !address && setIsMobileMenuOpen(false);
  }, [address]);

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

  return (
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
                <TopLevelLinks links={mainLinks} />
                <Box css={{ margin: 0, marginLeft: '1rem', color: '$gray400' }}>
                  {breadcrumb}
                </Box>
                <CircleNav />
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

export const TopLevelLinks = ({ links }: { links: INavItem[] }) => {
  return (
    <Box
      css={{
        justifySelf: 'stretch',
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        '@sm': {
          alignItems: 'flex-start',
          flexDirection: 'column',
        },
      }}
    >
      {links.map(navItem => (
        <Link css={linkStyle} as={NavLink} key={navItem.path} to={navItem.path}>
          {navItem.label}
        </Link>
      ))}
    </Box>
  );
};

// this has to be split out into its own component so it can suspend
const CircleNav = () => {
  const { circle, myUser } = useSelectedCircle();
  const links = getMainNavigation({
    asCircleAdmin: myUser.isCircleAdmin,
    asVouchingEnabled: circle.hasVouching,
  });

  return <TopLevelLinks links={links} />;
};

export default MainHeader;
