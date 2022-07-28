import { useRef, useState } from 'react';

import sortBy from 'lodash/sortBy';
import { useNavigate } from 'react-router';
import { useLocation, NavLink } from 'react-router-dom';
import { useRecoilValueLoadable } from 'recoil';

import { Hidden } from '@material-ui/core';

import { navLinkStyle, menuGroupStyle } from 'components/MainLayout/MainHeader';
import { scrollToTop } from 'components/MainLayout/MainLayout';
import isFeatureEnabled from 'config/features';
import { useHasCircles } from 'hooks/migration';
import { ChevronUp, ChevronDown } from 'icons';
import { rSelectedCircle } from 'recoilState/app';
import { paths, isCircleSpecificPath } from 'routes/paths';
import {
  Box,
  Link,
  Text,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverClose,
} from 'ui';

import { useOverviewMenuQuery } from './getOverviewMenuData';

const mainLinks = [
  [paths.circles, 'Overview'],
  isFeatureEnabled('vaults') && [paths.vaults, 'CoVaults'],
].filter(x => x) as [string, string][];

export const OverviewMenu = () => {
  const query = useOverviewMenuQuery();
  const orgs = query.data?.organizations;

  const navigate = useNavigate();
  const hasCircles = useHasCircles();

  const closeAndGo = (path: string) => {
    closePopover();
    scrollToTop();
    navigate(path);
  };

  const { circle } = useRecoilValueLoadable(rSelectedCircle).valueMaybe() || {};
  const location = useLocation();
  const inCircle = circle && isCircleSpecificPath(location);
  const overviewMenuTriggerText = inCircle
    ? circle.name
    : location.pathname.includes(paths.vaults)
    ? 'CoVaults'
    : 'Overview';
  const overviewMenuTrigger = (
    <Link
      css={navLinkStyle}
      className={
        paths.circles?.includes(location.pathname) ||
        location.pathname.includes('history')
          ? 'active'
          : ''
      }
      href="#"
    >
      {overviewMenuTriggerText}
      <Box css={{ marginLeft: '$xs', display: 'flex' }}>
        <ChevronDown size="md" />
      </Box>
    </Link>
  );

  const [mouseEnterPopover, setMouseEnterPopover] = useState(false);
  const [mouseEnterTrigger, setMouseEnterTrigger] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const closePopover = () => {
    setMouseEnterPopover(false);
  };

  return (
    <>
      <Hidden smDown>
        <Popover open={mouseEnterPopover || mouseEnterTrigger}>
          <PopoverTrigger
            asChild
            css={{ outline: 'none' }}
            ref={triggerRef}
            onMouseEnter={() => setMouseEnterTrigger(true)}
            onMouseLeave={() =>
              setTimeout(() => setMouseEnterTrigger(false), 200)
            }
          >
            {overviewMenuTrigger}
          </PopoverTrigger>
          <PopoverContent
            onMouseEnter={() => setMouseEnterPopover(true)}
            onMouseLeave={() =>
              setTimeout(() => setMouseEnterPopover(false), 200)
            }
            // These offset values must be dialed in browser.  CSS values/strings cannot be used, only numbers.
            sideOffset={-58}
            alignOffset={-3}
            css={{ outline: 'none' }}
          >
            <Box
              css={{
                display: 'flex',
                flexDirection: 'column',
                p: '$md',
              }}
            >
              <PopoverClose asChild>
                <Link
                  type="menu"
                  css={{
                    py: '$sm',
                    fontWeight: '$bold',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                  onClick={
                    inCircle
                      ? () => closeAndGo(paths.history(circle.id))
                      : undefined
                  }
                >
                  {overviewMenuTriggerText}
                  <Box css={{ marginLeft: '$xs', display: 'flex' }}>
                    <ChevronUp size="md" />
                  </Box>
                </Link>
              </PopoverClose>
              <Box
                css={{
                  display: 'flex',
                  flexDirection: 'column',
                  marginTop: '$sm',
                }}
              >
                {hasCircles && (
                  <TopLevelLinks links={mainLinks} onClick={closePopover} />
                )}
              </Box>
              {orgs?.map(org => (
                <Box key={org.id} css={menuGroupStyle}>
                  <Text variant="label" as="label">
                    {org.name}
                  </Text>
                  <Box css={{ display: 'flex', flexDirection: 'column' }}>
                    {sortBy(org.circles, c => c.name)
                      .filter(c => c.users.length)
                      .map(circle => (
                        <Link
                          key={circle.id}
                          type="menu"
                          onClick={() => closeAndGo(paths.history(circle.id))}
                        >
                          {circle.name}
                        </Link>
                      ))}
                  </Box>
                </Box>
              ))}
            </Box>
          </PopoverContent>
        </Popover>
      </Hidden>
    </>
  );
};

export const TopLevelLinks = ({
  links,
  onClick,
}: {
  links: [string, string, string[]?][];
  onClick?: () => void;
}) => {
  const location = useLocation();

  return (
    <>
      {links.map(([path, label, matchPaths]) => (
        <Link
          type="menu"
          css={{ pt: '$sm' }}
          as={NavLink}
          key={path}
          to={path}
          onClick={onClick}
          className={matchPaths?.includes(location.pathname) ? 'active' : ''}
        >
          {label}
        </Link>
      ))}
    </>
  );
};
