import { useRef, useState } from 'react';

import sortBy from 'lodash/sortBy';
import { useNavigate } from 'react-router';
import { useLocation, NavLink } from 'react-router-dom';
import { useRecoilValueLoadable } from 'recoil';

import { Awaited } from '../../../api-lib/ts4.5shim';
import { navLinkStyle } from '../MainLayout/TopLevelLinks';
import { menuGroupStyle } from 'components/MainLayout/MainHeader';
import { scrollToTop } from 'components/MainLayout/MainLayout';
import isFeatureEnabled from 'config/features';
import { useHasCircles } from 'hooks/migration';
import { ChevronDown, ChevronUp } from 'icons/__generated';
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
  POPOVER_TIMEOUT,
} from 'ui';

import type { getMainHeaderData } from './getMainHeaderData';

const mainLinks = [
  [paths.circles, 'Overview'],
  isFeatureEnabled('vaults') && [paths.vaults, 'CoVaults'],
].filter(x => x) as [string, string][];

export const OverviewMenu = ({
  data,
}: {
  data?: Awaited<ReturnType<typeof getMainHeaderData>>;
}) => {
  const orgs = data?.organizations;

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
        location.pathname === paths.circles ||
        location.pathname.includes('history') ||
        location.pathname.includes(paths.vaults)
          ? 'active'
          : ''
      }
      href="#"
    >
      {overviewMenuTriggerText}
      <Box css={{ marginLeft: '$xs', display: 'flex' }}>
        <ChevronDown size="lg" />
      </Box>
    </Link>
  );

  const [mouseEnterPopover, setMouseEnterPopover] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const closePopover = () => {
    setMouseEnterPopover(false);
  };
  let timeoutId: ReturnType<typeof setTimeout>;

  return (
    <Popover open={mouseEnterPopover}>
      <PopoverTrigger
        asChild
        css={{ outline: 'none' }}
        ref={triggerRef}
        onMouseEnter={() => {
          clearTimeout(timeoutId);
          setMouseEnterPopover(true);
        }}
        onMouseLeave={() => {
          clearTimeout(timeoutId);
          timeoutId = setTimeout(
            () => setMouseEnterPopover(false),
            POPOVER_TIMEOUT
          );
        }}
      >
        {overviewMenuTrigger}
      </PopoverTrigger>
      <PopoverContent
        onMouseEnter={() => {
          clearTimeout(timeoutId);
          setMouseEnterPopover(true);
        }}
        onMouseLeave={() => {
          clearTimeout(timeoutId);
          timeoutId = setTimeout(
            () => setMouseEnterPopover(false),
            POPOVER_TIMEOUT
          );
        }}
        // These offset values must be dialed in browser.  CSS values/strings cannot be used, only numbers.
        sideOffset={-57}
        alignOffset={1}
        css={{ outline: 'none', mb: '$lg', zIndex: 2 }}
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
                <ChevronUp size="lg" />
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
                <Link
                  key={org.id}
                  type="menu"
                  onClick={() =>
                    // FIXME: only changes URL but doesn't refresh data load
                    closeAndGo(paths.organization(org.id.toString()))
                  }
                >
                  {org.name}
                </Link>
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
