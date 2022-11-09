import { Suspense, useEffect, useState } from 'react';

import { useNavigate } from 'react-router';
import { NavLink, useLocation } from 'react-router-dom';

import { RecentTransactionsModal } from 'components/MyAvatarMenu/RecentTransactionsModal';
import isFeatureEnabled from 'config/features';
import type { WalletStatus } from 'hooks/login';
import { X, Menu, ChevronRight } from 'icons/__generated';
import { useMyProfile } from 'recoilState';
import { paths } from 'routes/paths';
import { Box, IconButton, Link, Image, Avatar, Text, Flex, Button } from 'ui';
import { shortenAddress } from 'utils';

import { CircleNav } from './CircleNav';
import { useMainHeaderQuery } from './getMainHeaderData';
import { TopLevelLinks } from './TopLevelLinks';

import { IApiCircle } from 'types';

const mainLinks = [
  [paths.circles, 'Overview'],
  isFeatureEnabled('vaults') && [paths.vaults, 'CoVaults'],
].filter(x => x) as [string, string][];

type Props = { inCircle?: IApiCircle; walletStatus: WalletStatus };
export const MobileHeader = ({ inCircle, walletStatus }: Props) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { icon, address, logout } = walletStatus;
  const org = inCircle ? inCircle?.organization : null;
  const navigate = useNavigate();
  const [showTxModal, setShowTxModal] = useState(false);

  const query = useMainHeaderQuery();
  const hasClaims = (query.data?.claims_aggregate.aggregate?.count || 0) > 0;
  const myProfile = useMyProfile();

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  useEffect(() => {
    !address && setIsMobileMenuOpen(false);
  }, [address]);

  return (
    <Suspense fallback={<span />}>
      <Box>
        {showTxModal && (
          <RecentTransactionsModal onClose={() => setShowTxModal(false)} />
        )}
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
            <Flex
              column
              css={{
                display: 'flex',
                position: 'absolute',
                backgroundColor: '$surface',
                height: '85%',
                width: '100%',
                overflow: 'scroll',
                overscrollBehaviorY: 'auto',
                '-webkit-overflow-scrolling': 'touch',
                zIndex: 2,
                p: '$lg',
                '> div': {
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  width: '100%',
                  borderTop: '1px solid $border',
                  mt: '$md',
                  pt: '$md',
                  '&:first-of-type': {
                    borderTop: 'none',
                    mt: 0,
                    pt: 0,
                  },
                },
                div: {
                  gap: '$sm',
                },
                '*': {
                  fontSize: '$large',
                  color: '$text',
                },
                a: {
                  position: 'unset',
                  color: '$text',
                  fontWeight: 'normal',
                  p: 0,
                  '&:hover': {
                    borderColor: 'transparent',
                    color: '$link',
                    '&::after': {
                      content: 'none',
                    },
                  },
                  '&.active': {
                    background: 'none',
                    fontWeight: 'normal',
                    '&::after': {
                      content: 'none',
                    },
                  },
                },
              }}
            >
              <TopLevelLinks links={mainLinks} />
              {inCircle && (
                <Flex>
                  <Flex
                    alignItems="center"
                    css={{ gap: '$sm', flexWrap: 'wrap' }}
                  >
                    {org?.id && (
                      <Link
                        css={{ display: 'flex', gap: '$sm' }}
                        key={inCircle.id}
                        type="menu"
                        onClick={() => {
                          navigate(paths.organization(org.id.toString()));
                        }}
                      >
                        <Avatar path={org.logo} size="xs" name={org.name} />
                        <Text semibold h3>
                          {org.name}
                        </Text>
                      </Link>
                    )}
                    <ChevronRight color="neutral" />
                    <Link
                      css={{ display: 'flex', gap: '$sm' }}
                      key={inCircle.id}
                      type="menu"
                      onClick={() => {
                        navigate(paths.history(inCircle.id));
                      }}
                    >
                      <Avatar
                        path={inCircle?.logo}
                        size="xs"
                        name={inCircle.name}
                      />
                      <Text semibold h3>
                        {inCircle.name}
                      </Text>
                    </Link>
                  </Flex>
                  <Suspense fallback={<span />}>
                    <CircleNav />
                  </Suspense>
                </Flex>
              )}
              <Flex column alignItems="start">
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
                    <Avatar path={myProfile.avatar} />
                  </Flex>
                  Profile
                </Link>
                <Link type="menu" as={NavLink} to={paths.circles}>
                  Circles
                </Link>
                {isFeatureEnabled('vaults') && (
                  <>
                    {hasClaims ? (
                      <Button
                        as={NavLink}
                        to="/claims"
                        color="complete"
                        css={{
                          color: '$white',
                          fontWeight: '$normal',
                        }}
                      >
                        Claim Tokens
                      </Button>
                    ) : (
                      <Link type="menu" as={NavLink} to={paths.circles}>
                        Claims
                      </Link>
                    )}
                  </>
                )}
                <Flex column>
                  {address && (
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
                  )}
                  {isFeatureEnabled('vaults') && (
                    <Link href="#" onClick={() => setShowTxModal(true)}>
                      Recent Transactions
                    </Link>
                  )}
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
            </Flex>
          </Box>
        )}
      </Box>
    </Suspense>
  );
};
