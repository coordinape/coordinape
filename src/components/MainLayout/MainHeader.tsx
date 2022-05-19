import { Suspense, useState, useEffect, useMemo } from 'react';

import debug from 'debug';
import { useLocation, NavLink } from 'react-router-dom';
import { useRecoilValueLoadable } from 'recoil';
import { MediaQueryKeys, CSS } from 'stitches.config';

import { ReceiveInfo, MyAvatarMenu, NewApeAvatar } from 'components';
import { useWalletStatus } from 'components/MyAvatarMenu/MyAvatarMenu';
import isFeatureEnabled from 'config/features';
import { useMediaQuery } from 'hooks';
import { HamburgerIcon, CloseIcon } from 'icons';
import { useSetWalletModalOpen } from 'recoilState';
import {
  rSelectedCircle,
  useMyProfile,
  useSelectedCircle,
} from 'recoilState/app';
import { useHasCircles } from 'recoilState/db';
import { EXTERNAL_URL_DOCS, isCircleSpecificPath, paths } from 'routes/paths';
import { Box, IconButton, Link, Image, Button } from 'ui';
import { shortenAddress } from 'utils';

const log = debug('recoil:MainHeader');

const mainLinks = [
  [paths.circles, 'Circles'],
  isFeatureEnabled('vaults') && [paths.vaults, 'Vaults'],
].filter(x => x) as [string, string][];

export const MainHeader = () => {
  const { address } = useWalletStatus();
  const hasCircles = useHasCircles();
  const { circle } = useRecoilValueLoadable(rSelectedCircle).valueMaybe() || {};
  const location = useLocation();
  const inCircle = circle && isCircleSpecificPath(location);
  if (circle?.id) log(`circle: ${circle?.id}`);
  const breadcrumb = inCircle ? `${circle.protocol.name} > ${circle.name}` : '';

  if (useMediaQuery(MediaQueryKeys.sm))
    return (
      <Suspense fallback={null}>
        <MobileHeader inCircle={!!inCircle} breadcrumb={breadcrumb} />
      </Suspense>
    );

  return (
    <Box
      css={{
        px: '$1xl',
        pt: '9px', // manual offset to align breadcrumb
        height: '80px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: '$text',
      }}
    >
      <Image
        alt="logo"
        css={{ height: '$1xl', mr: '$md' }}
        src="/svgs/logo/logo.svg"
      />
      {hasCircles && <TopLevelLinks links={mainLinks} />}

      <Box
        css={{
          display: 'flex',
          flexGrow: 1,
          justifyContent: 'flex-end',
          position: 'relative',
          top: '-7px', // half of breadcrumb line-height
        }}
      >
        {inCircle && (
          <Box>
            <Box
              css={{ color: '$secondaryText', ml: '$md', lineHeight: '14px' }}
            >
              {breadcrumb}
            </Box>

            <Suspense fallback={null}>
              <CircleNav />
            </Suspense>
          </Box>
        )}
      </Box>
      {inCircle && (
        <Suspense fallback={null}>
          <ReceiveInfo />
        </Suspense>
      )}
      {!address && <ConnectButton />}
      <Suspense fallback={null}>
        <MyAvatarMenu />
      </Suspense>
    </Box>
  );
};

const ConnectButton = () => {
  const setWalletModalOpen = useSetWalletModalOpen();

  return (
    <Button
      color="surface"
      size="small"
      onClick={() => setWalletModalOpen(true)}
    >
      Connect your wallet
    </Button>
  );
};

const MobileHeader = ({
  breadcrumb,
  inCircle,
}: {
  breadcrumb: string;
  inCircle: boolean;
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { icon, address, logout } = useWalletStatus();

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  useEffect(() => {
    !address && setIsMobileMenuOpen(false);
  }, [address]);

  const menuWalletButton = !address ? (
    <ConnectButton />
  ) : (
    <IconButton
      onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      aria-label="menu"
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
          background: '$text',
          justifyContent: 'space-between',
          px: '$lg',
          py: '$md',
        }}
      >
        <Image alt="logo" css={{ height: 40 }} src="/svgs/logo/logo.svg" />
        {menuWalletButton}
      </Box>
      {isMobileMenuOpen && (
        <Box
          css={{
            height: '100vh',
            position: 'relative',
            backgroundColor: '$surface',
          }}
        >
          <Box
            css={{
              display: 'flex',
              flexDirection: 'column',
              position: 'absolute',
              backgroundColor: '$surface',
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
            <Box css={{ pb: '$md' }}>
              <TopLevelLinks links={mainLinks} />
              {inCircle && (
                <>
                  <Box
                    css={{
                      margin: 0,
                      marginLeft: '1rem',
                      color: '$secondaryText',
                    }}
                  >
                    {breadcrumb}
                  </Box>
                  <Suspense fallback={<span />}>
                    <CircleNav />
                  </Suspense>
                </>
              )}
              <Box
                css={{
                  '> *': {
                    mx: '$md',
                    py: '$xs',
                    fontSize: '$large',
                    color: '$text',
                  },
                }}
              >
                <Link
                  href={EXTERNAL_URL_DOCS}
                  target="_blank"
                  css={{ display: 'block' }}
                >
                  Docs
                </Link>
                <Link
                  as={NavLink}
                  to={paths.profile('me')}
                  css={{ display: 'flex', alignItems: 'center', gap: '$sm' }}
                >
                  <Box
                    css={{
                      width: '$lg',
                      height: '$lg',
                      '> *': {
                        width: '100% !important',
                        height: '100% !important',
                      },
                    }}
                  >
                    <MobileAvatar />
                  </Box>
                  My Profile
                </Link>
                <Box
                  css={{ display: 'flex', alignItems: 'center', gap: '$sm' }}
                >
                  <Box
                    css={{
                      display: 'flex',
                      width: '$lg',
                      height: '$lg',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {icon}
                  </Box>
                  {address && shortenAddress(address)}
                </Box>
                {address && (
                  <Link
                    css={{ cursor: 'pointer', display: 'block' }}
                    onClick={logout}
                  >
                    Log Out
                  </Link>
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

const MobileAvatar = () => {
  const myProfile = useMyProfile();

  return (
    <Suspense fallback={null}>
      <NewApeAvatar path={myProfile.avatar} />
    </Suspense>
  );
};

const linkStyle = {
  my: 0,
  mx: '$md',
  fontSize: '$large',
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
    backgroundColor: '$red4',
    transition: 'all 0.3s',
    bottom: 0,
    height: 2,
  },
  '&:hover': {
    '&::after': {
      left: 0,
      right: 0,
      backgroundColor: '$red4',
    },
  },
  '&.active': {
    '&::after': {
      left: 0,
      right: 0,
      backgroundColor: '$alert',
    },
    '&:hover': {
      '&::after': {
        left: 0,
        right: 0,
        backgroundColor: '$alert',
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
      color: '$alert',
      '&::after': {
        content: 'none',
      },
    },
  },
};

export const TopLevelLinks = ({
  links,
  css = {},
}: {
  links: [string, string, string[]?][];
  css?: CSS;
}) => {
  const location = useLocation();

  return (
    <Box
      css={{
        display: 'flex',
        '@sm': {
          alignItems: 'flex-start',
          flexDirection: 'column',
        },
        ...css,
      }}
    >
      {links.map(([path, label, matchPaths]) => (
        <Link
          css={linkStyle}
          as={NavLink}
          key={path}
          to={path}
          className={matchPaths?.includes(location.pathname) ? 'active' : ''}
        >
          {label}
        </Link>
      ))}
    </Box>
  );
};

// this has to be split out into its own component so it can suspend
const CircleNav = () => {
  const { circle, myUser } = useSelectedCircle();

  const links: [string, string, string[]?][] = useMemo(() => {
    const l: [string, string, string[]?][] = [
      [paths.history, 'History'],
      [paths.allocation, 'Allocate', [paths.epoch, paths.team, paths.give]],
      [paths.map(), 'Map'],
    ];

    if (circle.hasVouching) l.push([paths.vouching, 'Vouching']);
    if (myUser.isCircleAdmin) l.push([paths.adminCircles, 'Admin']);
    return l;
  }, [circle.id]);

  return <TopLevelLinks links={links} css={{ mr: '$md' }} />;
};

export default MainHeader;
