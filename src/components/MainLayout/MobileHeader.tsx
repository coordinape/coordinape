import { Suspense, useEffect, useState } from 'react';

import { NavLink, useLocation } from 'react-router-dom';

import { NewApeAvatar } from 'components';
import isFeatureEnabled from 'config/features';
import { useWalletStatus } from 'hooks/login';
import { X, Menu } from 'icons/__generated';
import { useMyProfile } from 'recoilState/app';
import { paths } from 'routes/paths';
import { Box, IconButton, Link, Image } from 'ui';
import { shortenAddress } from 'utils';

import { CircleNav } from './CircleNav';
import { TopLevelLinks } from './TopLevelLinks';

const mainLinks = [
  [paths.circles, 'Overview'],
  isFeatureEnabled('vaults') && [paths.vaults, 'CoVaults'],
].filter(x => x) as [string, string][];

export const MobileHeader = ({
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
          color="white"
        >
          {!isMobileMenuOpen ? <Menu size="lg" /> : <X size="lg" />}
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
