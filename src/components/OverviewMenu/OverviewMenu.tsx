import { useEffect, useState } from 'react';

import sortBy from 'lodash/sortBy';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router';
import { useLocation, NavLink } from 'react-router-dom';
import { useRecoilValueLoadable } from 'recoil';

import { Popover, makeStyles, Hidden } from '@material-ui/core';

import { linkStyle } from 'components/MainLayout/MainHeader';
import { scrollToTop } from 'components/MainLayout/MainLayout';
import isFeatureEnabled from 'config/features';
import { useApiBase } from 'hooks';
import { useCurrentOrgId } from 'hooks/gql/useCurrentOrg';
import useConnectedAddress from 'hooks/useConnectedAddress';
import { ChevronUp, ChevronDown } from 'icons';
import { rSelectedCircle } from 'recoilState/app';
import { useHasCircles } from 'recoilState/db';
import { paths, isCircleSpecificPath } from 'routes/paths';
import { Box, Link, Text } from 'ui';

import { getOrgData } from './getOrgData';

import type { Awaited } from 'types/shim';

type QueryResult = Awaited<ReturnType<typeof getOrgData>>;

const useStyles = makeStyles(theme => ({
  popover: {
    marginTop: theme.spacing(0.5),
    padding: 0,
    borderRadius: 8,
    background: '#FFFFFF',
    boxShadow:
      '0px 0px 3px 0px #0000001C, 0px 0px 16px 0px #0000001F, 0px 0px 87px 0px #0000003D',
    display: 'flex',
    flexDirection: 'column',
    top: '13.5px !important',
    left: '45px !important',
    transition: 'none !important',
  },
}));

const mainLinks = [
  [paths.circles, 'Overview'],
  isFeatureEnabled('vaults') && [paths.vaults, 'Vaults'],
].filter(x => x) as [string, string][];

export const OverviewMenu = () => {
  const classes = useStyles();
  const address = useConnectedAddress();
  const query = useQuery(
    ['myOrgs', address],
    () => getOrgData(address as string),
    {
      enabled: !!address,
    }
  );
  const orgs = query.data?.organizations;

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const navigate = useNavigate();
  const { selectCircle } = useApiBase();
  const hasCircles = useHasCircles();
  const [currentOrgId, setCurrentOrgId] = useCurrentOrgId();

  useEffect(() => {
    if (orgs?.length && !currentOrgId) {
      setCurrentOrgId(orgs[0].id);
    }
  }, [orgs]);

  const goToCircle = (id: number, path: string) => {
    setCurrentOrgId(orgs?.find(o => o.circles.some(c => c.id === id))?.id);
    selectCircle(id).then(() => {
      scrollToTop();
      navigate(path);
    });
  };

  const { circle } = useRecoilValueLoadable(rSelectedCircle).valueMaybe() || {};
  const location = useLocation();
  const inCircle = circle && isCircleSpecificPath(location);
  const currentCircle = inCircle ? `${circle.name}` : '';
  const overviewMenuTriggerText = inCircle
    ? currentCircle
    : location.pathname.includes(paths.vaults)
    ? 'Vaults'
    : 'Overview';

  return (
    <>
      <Link
        css={linkStyle}
        onClick={event => setAnchorEl(event.currentTarget)}
        className={
          paths.circles?.includes(location.pathname) ||
          location.pathname.includes(paths.history)
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
      <Hidden smDown>
        <Popover
          anchorEl={anchorEl}
          classes={{ paper: classes.popover }}
          id="overview-popover"
          onClick={() => setTimeout(() => setAnchorEl(null))}
          onClose={() => setAnchorEl(null)}
          open={!!anchorEl}
        >
          <Box
            css={{
              display: 'flex',
              flexDirection: 'column',
              p: '$md',
            }}
          >
            <Link
              type="menu"
              css={{
                py: '$sm',
                fontWeight: '$bold',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              {overviewMenuTriggerText}
              <Box css={{ marginLeft: '$xs', display: 'flex' }}>
                <ChevronUp size="md" />
              </Box>
            </Link>
            <Box
              css={{
                display: 'flex',
                flexDirection: 'column',
                marginTop: '$sm',
                marginBottom: '$md',
              }}
            >
              {hasCircles && <TopLevelLinks links={mainLinks} />}
            </Box>
            {orgs?.map(org => (
              <Box key={org.id} css={{ mb: '$md' }}>
                <Text variant="label" as="label">
                  {org.name}
                </Text>
                <Box css={{ display: 'flex', flexDirection: 'column' }}>
                  {sortBy(org.circles, c => -c.users.length).map(circle => (
                    <CircleItem
                      circle={circle}
                      key={circle.id}
                      onButtonClick={goToCircle}
                    />
                  ))}
                </Box>
              </Box>
            ))}
          </Box>
        </Popover>
      </Hidden>
    </>
  );
};

type QueryCircle = QueryResult['organizations'][0]['circles'][0];

type CircleItemProps = {
  circle: QueryCircle;
  onButtonClick: (id: number, path: string) => void;
};

export const TopLevelLinks = ({
  links,
}: {
  links: [string, string, string[]?][];
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
          className={matchPaths?.includes(location.pathname) ? 'active' : ''}
        >
          {label}
        </Link>
      ))}
    </>
  );
};

const CircleItem = ({ circle, onButtonClick }: CircleItemProps) => {
  const role = circle.users[0]?.role;
  const nonMember = role === undefined;
  return (
    <Link
      type="menu"
      css={{ pt: '$sm' }}
      onClick={() => !nonMember && onButtonClick(circle.id, paths.history)}
    >
      {circle.name}
    </Link>
  );
};
