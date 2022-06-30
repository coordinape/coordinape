import assert from 'assert';
import { Suspense, useState, useEffect, useMemo } from 'react';

import { useLocation, NavLink } from 'react-router-dom';
import { useRecoilValueLoadable } from 'recoil';
import { MediaQueryKeys, CSS } from 'stitches.config';

import {
  ReceiveInfo,
  MyAvatarMenu,
  NewApeAvatar,
  OverviewMenu,
} from 'components';
import isFeatureEnabled from 'config/features';
import { useMediaQuery } from 'hooks';
import { useWalletStatus } from 'hooks/login';
import { HamburgerIcon, CloseIcon } from 'icons';
import ClaimsNavButton from 'pages/ClaimsPage/ClaimsNavButton';
import {
  rSelectedCircle,
  useMyProfile,
  useSelectedCircle,
} from 'recoilState/app';
import { EXTERNAL_URL_DOCS, isCircleSpecificPath, paths } from 'routes/paths';
import { Box, IconButton, Link, Image } from 'ui';
import { shortenAddress } from 'utils';

const mainLinks = [
  [paths.circles, 'Overview'],
  isFeatureEnabled('vaults') && [paths.vaults, 'coVaults'],
].filter(x => x) as [string, string][];

export const MainHeader = () => {
  const { circle } = useRecoilValueLoadable(rSelectedCircle).valueMaybe() || {};
  const location = useLocation();
  const inCircle = circle && isCircleSpecificPath(location);
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
        height: '$headerHeight',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        background: '$headingText',
      }}
    >
      <Box
        css={{
          p: '$sm $md $xs',
          color: '$neutral',
          fontWeight: '$black',
        }}
      >
        COORDINAPE
      </Box>
      <Box
        css={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'relative',
        }}
      >
        <OverviewMenu />
        <Box
          css={{
            display: 'flex',
            flexGrow: 1,
            justifyContent: 'flex-start',
            position: 'relative',
          }}
        >
          {inCircle && (
            <Box>
              <Suspense fallback={null}>
                <CircleNav />
              </Suspense>
            </Box>
          )}
        </Box>
        {inCircle && !isFeatureEnabled('vaults') && (
          <Suspense fallback={null}>
            <ReceiveInfo />
          </Suspense>
        )}
        <Suspense fallback={null}>
          {isFeatureEnabled('vaults') && <ClaimsNavButton />}
          <MyAvatarMenu />
        </Suspense>
      </Box>
    </Box>
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

export const menuGroupStyle = {
  display: 'flex',
  flexDirection: 'column',
  borderTop: '1px solid $border',
  width: '100%',
  mt: '$md',
  'a, label': {
    mt: '$sm',
  },
};

export const navLinkStyle = {
  my: 0,
  mr: '$xs',
  fontSize: '$large',
  color: '$white',
  borderRadius: '$pill',
  textDecoration: 'none',
  px: '$md',
  py: '$sm',
  position: 'relative',
  border: '1px solid transparent',
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
  '&:hover': {
    borderColor: '$secondaryText',
  },
  '&.active': {
    backgroundColor: '$borderMedium',
    fontWeight: '$bold',
    color: '$text',
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
          css={navLinkStyle}
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
    assert(circle.id);
    const l: [string, string, string[]?][] = [
      [
        paths.allocation(circle.id),
        'Allocate',
        [paths.epoch(circle.id), paths.team(circle.id), paths.give(circle.id)],
      ],
      [paths.map(circle.id), 'Map'],
    ];

    if (circle.hasVouching) l.push([paths.vouching(circle.id), 'Vouching']);
    if (myUser.isCircleAdmin) {
      l.push([paths.members(circle.id), 'Admin']);
    }

    return l;
  }, [circle.id]);

  return <TopLevelLinks links={links} css={{ mr: '$xs' }} />;
};

export default MainHeader;
