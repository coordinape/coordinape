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
    <Text
      css={{
        ...navLinkStyle,
        mr: 0,
        '@md': {
          fontSize: '$md',
        },
      }}
      className={
        location.pathname === paths.circles ||
        location.pathname.includes('history') ||
        location.pathname.includes(paths.vaults)
          ? 'active'
          : ''
      }
    >
      {overviewMenuTriggerText}
      <Box css={{ marginLeft: '$xs', display: 'flex' }}>
        <ChevronDown size="lg" />
      </Box>
    </Text>
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
        tabIndex={0}
        css={{
          borderRadius: '$pill',
          mr: '$xs',
        }}
        ref={triggerRef}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            setMouseEnterPopover(true);
          }
        }}
        onMouseDown={() => {
          clearTimeout(timeoutId);
          setMouseEnterPopover(true);
        }}
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
        onKeyDown={e => {
          if (e.key === 'Escape') {
            setMouseEnterPopover(false);
          }
        }}
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
        css={{
          outline: 'none',
          position: 'relative',
          left: '$xl',
          // 1px border position bugfix:
          pl: '1px',
          top: 'calc($xxs - $3xl + 1px)',
          mb: '$lg',
          minWidth: 'calc($4xl * 4.25)',
          zIndex: 4,
        }}
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
              <Link
                key={org.id}
                type="menu"
                href={paths.organization(org.id.toString())}
                onClick={e => {
                  if (!e.metaKey || !e.ctrlKey) {
                    e.preventDefault();
                    closeAndGo(paths.organization(org.id.toString()));
                  }
                }}
              >
                <Text variant="label">{org.name}</Text>
              </Link>
              <Box css={{ display: 'flex', flexDirection: 'column' }}>
                {sortBy(org.circles, c => c.name)
                  .filter(c => c.users.length)
                  .map(circle => (
                    <Link
                      key={circle.id}
                      type="menu"
                      href={paths.history(circle.id)}
                      onClick={e => {
                        if (!e.metaKey || !e.ctrlKey) {
                          e.preventDefault();
                          closeAndGo(paths.history(circle.id));
                        }
                      }}
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
