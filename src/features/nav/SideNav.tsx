import { useEffect, useState } from 'react';

import { HomeIcon } from '@radix-ui/react-icons';

import { paths } from '../../routes/paths';
import { Box } from '../../ui';
import { ThemeSwitcher } from '../theming/ThemeSwitcher';

import { NavCircle, NavOrg, useNavQuery } from './getNavData';
import { NavCircles } from './NavCircles';
import { NavItem } from './NavItem';
import { NavLogo } from './NavLogo';
import { NavOrgs } from './NavOrgs';

export const SideNav = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [open, setOpen] = useState(true);
  const [currentCircle, setCurrentCircle] = useState<NavCircle | undefined>(
    undefined
  );
  const [currentOrg, setCurrentOrg] = useState<NavOrg | undefined>(undefined);

  const { data } = useNavQuery();

  useEffect(() => {
    if (data) {
      if (data.organizations) {
        setCurrentOrg(data.organizations[0]);
        if (data.organizations[0].circles) {
          setCurrentCircle(data.organizations[0].circles[0]);
        }
      }
    }
  }, [data]);

  return (
    <Box
      css={{
        width: open ? '250px' : '64px',
        transition: 'width 0.3s ease-in-out',
        background: '$navBackground',
        height: '100vh',
        paddingLeft: 24,
        paddingRight: 24,
        paddingBottom: 24,
        display: 'flex',
        flexDirection: 'column',
      }}
      // onClick={() => setOpen(prev => !prev)}
    >
      <NavLogo
        navOpen={open}
        css={{
          marginTop: 32,
          maxWidth: open ? 140 : 48,
        }}
      />

      <Box css={{ flex: 1, paddingTop: 36 }}>
        <NavItem label="Home" to={paths.home} icon={<HomeIcon />} />
        <NavItem label="Home" to={paths.home} icon={<HomeIcon />} />
        <NavItem label="Home" to={paths.home} icon={<HomeIcon />} />
        <NavItem label="Home" to={paths.home} icon={<HomeIcon />} />
        {data && (
          <>
            <NavOrgs orgs={data.organizations} currentOrg={currentOrg} />
            {currentOrg && (
              <NavCircles org={currentOrg} currentCircle={currentCircle} />
            )}
          </>
        )}
      </Box>
      <ThemeSwitcher />
    </Box>
  );
};
