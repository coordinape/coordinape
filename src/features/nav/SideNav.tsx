import { Suspense, useEffect, useState } from 'react';

import { useLocation } from 'react-router-dom';

import { getCircleFromPath, getOrgFromPath, paths } from '../../routes/paths';
import { CoOrg, Menu, X } from 'icons/__generated';
import { Flex, IconButton } from 'ui';

import { NavCircle, NavOrg, useNavQuery } from './getNavData';
import { NavCircles } from './NavCircles';
import { NavClaimsButton } from './NavClaimsButton';
import { NavItem } from './NavItem';
import { NavLogo } from './NavLogo';
import { NavOrgs } from './NavOrgs';
import { NavProfile } from './NavProfile';

export const SideNav = () => {
  /*
    TODO: review semantic color names
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
          position: 'relative',
          zIndex: '2',
          // gradient overlaying overflowing links
          '&::after': {
            content: '',
            position: 'absolute',
            background: 'linear-gradient($navBackground, transparent)',
            width: 'calc(100% + 6px)',
            height: '$2xl',
            bottom: '-$2xl',
            left: '-3px',
            pointerEvents: 'none',
            zIndex: '2',
            display: mobileMenuOpen ? 'block' : 'none',
          },
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
          // use enough pb for the scrolly gradient overlay
          pb: '$4xl',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
          scrollbarWidth: 'none',
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
              width: 'calc(100% + 6px)',
              height: '100px',
              top: '-103px',
              left: '-3px',
              pointerEvents: 'none',
              zIndex: '2',
            },
          }}
        >
          {data && (
            <NavProfile name={data.profile.name} avatar={data.profile.avatar} />
          )}
        </Flex>
      </Suspense>
    </Flex>
  );
};
