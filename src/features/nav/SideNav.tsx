import { Suspense, useEffect, useState } from 'react';

import { QueryClient } from 'react-query';
import { useLocation } from 'react-router-dom';

import { getCircleFromPath, getOrgFromPath, paths } from '../../routes/paths';
import { CoOrg, Menu, X } from 'icons/__generated';
import { Flex, IconButton } from 'ui';

import { NavCircle, NavOrg, QUERY_KEY_NAV, useNavQuery } from './getNavData';
import { NavCircles } from './NavCircles';
import { NavClaimsButton } from './NavClaimsButton';
import { NavItem } from './NavItem';
import { NavLogo } from './NavLogo';
import { NavOrgs } from './NavOrgs';
import { NavProfile } from './NavProfile';

export const InvalidateSideNav = async (queryClient: QueryClient) => {
  await queryClient.invalidateQueries(QUERY_KEY_NAV);
};

export const SideNav = () => {
  /*
    TODO: review semantic color names
    TODO: what's your name prompt
   */
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentCircle, setCurrentCircle] = useState<NavCircle | undefined>(
    undefined
  );
  const [currentOrg, setCurrentOrg] = useState<NavOrg | undefined>(undefined);

  const location = useLocation();
  const { data } = useNavQuery();

  const showClaimsButton = (data?.claims_aggregate.aggregate?.count || 0) > 0;

  const setCircleAndOrgIfMatch = (orgs: NavOrg[]) => {
    const circleId = getCircleFromPath(location);
    const orgId = getOrgFromPath(location);

    for (const o of orgs) {
      if (circleId) {
        for (const c of o.circles) {
          if (c.id == +circleId) {
            setCurrentCircle(c);
            setCurrentOrg(o);
            return;
          }
        }
      }
      setCurrentCircle(undefined);
      if (orgId && o.id == +orgId) {
        setCurrentOrg(o);
        return;
      }
      setCurrentOrg(undefined);
    }
  };

  useEffect(() => {
    if (data) {
      if (data.organizations) {
        setCircleAndOrgIfMatch(data.organizations);
      }
    }
  }, [data, location]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  return (
    <Flex
      css={{
        flexGrow: 0,
        flexShrink: 0,
        background: '$navBackground',
        height: '100vh',
        position: 'static',
        p: '$xl $lg $lg',
        flexDirection: 'column',
        width: '350px',
        transition: '.2s ease-in-out',
        '@lg': { width: '300px' },
        '@md': { width: '250px' },
        '@sm': {
          position: 'absolute',
          left: mobileMenuOpen ? '0' : '-100vw',
          width: '100vw',
          zIndex: 2,
          background: '$navBackground',
          pt: '$3xl',
        },
      }}
    >
      <Flex
        css={{
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '$md',
          button: { display: 'none' },
          '@sm': {
            background: mobileMenuOpen ? '$surfaceNested' : '$navBackground',
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            p: '$md $lg',
            button: { display: 'flex' },
          },
        }}
      >
        <NavLogo />
        <IconButton onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size="lg" /> : <Menu size="lg" />}
        </IconButton>
      </Flex>

      <Flex
        column
        css={{
          flex: 1,
          overflowY: 'auto',
          pt: '$xl',
          // So focus outlines don't get cropped
          mx: '-3px',
          px: '3px',
        }}
      >
        <NavItem label="Home" to={paths.circles} icon={<CoOrg nostroke />} />
        {data && (
          <>
            <NavOrgs
              orgs={data.organizations}
              currentOrg={currentOrg}
              currentCircle={currentCircle}
            />
            {currentOrg && (
              <NavCircles org={currentOrg} currentCircle={currentCircle} />
            )}
          </>
        )}
      </Flex>

      {showClaimsButton && <NavClaimsButton />}
      <Suspense fallback={null}>
        <Flex
          css={{
            mt: '$sm',
            width: '100%',
            position: 'relative',
            // gradient overlaying overflowing links
            '&::after': {
              content: '',
              position: 'absolute',
              background: 'linear-gradient(transparent, $navBackground)',
              width: '100%',
              height: '100px',
              top: '-103px',
              pointerEvents: 'none',
            },
          }}
        >
          <NavProfile />
        </Flex>
      </Suspense>
    </Flex>
  );
};
