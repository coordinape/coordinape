import { Suspense, useEffect, useState } from 'react';

import { QueryClient } from 'react-query';
import { useLocation } from 'react-router-dom';

import { CoOrg } from '../../icons/__generated';
import { getCircleFromPath, getOrgFromPath, paths } from '../../routes/paths';
import { Flex } from '../../ui';

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
    TODO: scrolly gradient
    TODO: what's your name prompt
   */
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

  return (
    <Flex
      css={{
        flexGrow: 0,
        flexShrink: 0,
        width: '250px',
        background: '$navBackground',
        height: '100vh',
        position: 'static',
        paddingLeft: '$lg',
        paddingRight: '$lg',
        paddingBottom: '$lg',
        flexDirection: 'column',
      }}
    >
      <NavLogo
        css={{
          marginTop: '$xl',
        }}
      />

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
        {/*TODO: little gradient to show there is scrollable content*/}
        {/*<Box*/}
        {/*  css={{*/}
        {/*    position: 'absolute',*/}
        {/*    bottom: 0,*/}
        {/*    left: 0,*/}
        {/*    right: 0,*/}
        {/*    height: 100,*/}
        {/*    background: 'red',*/}
        {/*    zIndex: 3,*/}
        {/*  }}*/}
        {/*></Box>*/}
      </Flex>

      {showClaimsButton && <NavClaimsButton />}
      <Suspense fallback={null}>
        <Flex css={{ mt: '$sm', width: '100%' }}>
          <NavProfile />
        </Flex>
      </Suspense>
    </Flex>
  );
};
