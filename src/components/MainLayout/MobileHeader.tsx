import { Suspense, useEffect, useState } from 'react';

import { useNavigate } from 'react-router';
import { NavLink, useLocation } from 'react-router-dom';

import isFeatureEnabled from 'config/features';
import { useWalletStatus } from 'hooks/login';
import { X, Menu, ChevronRight } from 'icons/__generated';
import { useMyProfile } from 'recoilState/app';
import { paths } from 'routes/paths';
import { Box, IconButton, Link, Image, Avatar, Text, Flex } from 'ui';
import { shortenAddress } from 'utils';

import { CircleNav } from './CircleNav';
import { TopLevelLinks } from './TopLevelLinks';

const mainLinks = [
  [paths.circles, 'Overview'],
  isFeatureEnabled('vaults') && [paths.vaults, 'CoVaults'],
].filter(x => x) as [string, string][];

export const MobileHeader = ({
  circle,
  inCircle,
}: {
  circle: any;
  inCircle: boolean;
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { icon, address, logout } = useWalletStatus();
  const org = inCircle ? circle.organization : null;
  const navigate = useNavigate();

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
            <Box css={{ p: '$md' }}>
              <TopLevelLinks links={mainLinks} />
              {inCircle && (
                <Flex
                  column
                  css={{
                    gap: '$sm',
                    borderTop: '1px solid $border',
                    mt: '$md',
                    pt: '$md',
                  }}
                >
                  <Flex alignItems="center" css={{ gap: '$sm' }}>
                    <Link
                      css={{ display: 'flex', gap: '$sm' }}
                      key={circle.id}
                      type="menu"
                      onClick={() => {
                        navigate(paths.organization(org.id.toString()));
                      }}
                    >
                      <Avatar path={org?.logo} size="xs" name={org.name} />
                      <Text semibold h3>
                        {org.name}
                      </Text>
                    </Link>
                    <ChevronRight color="neutral" />
                    <Link
                      css={{ display: 'flex', gap: '$sm' }}
                      key={circle.id}
                      type="menu"
                      onClick={() => {
                        navigate(paths.history(circle.id));
                      }}
                    >
                      <Avatar
                        path={circle?.logo}
                        size="xs"
                        name={circle.name}
                      />
                      <Text semibold h3>
                        {circle.name}
                      </Text>
                    </Link>
                  </Flex>
                  <Suspense fallback={<span />}>
                    <CircleNav />
                  </Suspense>
                </Flex>
              )}
              <Flex
                column
                css={{
                  borderTop: '1px solid $border',
                  mt: '$md',
                  pt: '$md',
                  gap: '$sm',
                  '> *': {
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
                  <Flex
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
                  </Flex>
                  Profile
                </Link>
                <Link type="menu" as={NavLink} to={paths.circles}>
                  Circles
                </Link>
                {isFeatureEnabled('vaults') && (
                  <Link type="menu" as={NavLink} to={paths.claims}>
                    Claims
                  </Link>
                )}
                <Flex
                  column
                  css={{
                    borderTop: '1px solid $border',
                    mt: '$sm',
                    pt: '$md',
                    gap: '$sm',
                    '> *': {
                      fontSize: '$large',
                      color: '$text',
                    },
                  }}
                >
                  <Flex css={{ alignItems: 'center', gap: '$sm' }}>
                    <Flex
                      css={{
                        width: '$lg',
                        height: '$lg',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {icon}
                    </Flex>
                    {address && shortenAddress(address)}
                  </Flex>
                  {address && (
                    <Link
                      css={{ cursor: 'pointer', display: 'block' }}
                      onClick={logout}
                    >
                      Disconnect
                    </Link>
                  )}
                </Flex>
              </Flex>
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
      <Avatar path={myProfile.avatar} />
    </Suspense>
  );
};
