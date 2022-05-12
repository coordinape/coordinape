import { useEffect, useState } from 'react';

import sortBy from 'lodash/sortBy';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router';
import { useLocation, NavLink } from 'react-router-dom';
import { CSS } from 'stitches.config';

import { Popover, makeStyles, Hidden } from '@material-ui/core';

import { ReactComponent as ChevronDownSVG } from 'assets/svgs/chevron-down.svg';
import { ReactComponent as ChevronUpSVG } from 'assets/svgs/chevron-up.svg';
import isFeatureEnabled from 'config/features';
import { useApiBase } from 'hooks';
import { useCurrentOrgId } from 'hooks/gql/useCurrentOrg';
import useConnectedAddress from 'hooks/useConnectedAddress';
import { useHasCircles } from 'recoilState/db';
import { paths } from 'routes/paths';
import { Box, Link, Text } from 'ui';

import { getOrgData } from './getOrgData';

import type { Awaited } from 'types/shim';
type QueryResult = Awaited<ReturnType<typeof getOrgData>>;

const useStyles = makeStyles(theme => ({
  popover: {
    maxWidth: 200,
    marginTop: theme.spacing(0.5),
    padding: 0,
    borderRadius: 8,
    background: '#FFFFFF',
    boxShadow: '0px 4px 6px rgba(181, 193, 199, 0.16)',
    display: 'flex',
    flexDirection: 'column',
    top: '16px !important',
    left: '44px !important',
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
  const { selectAndFetchCircle } = useApiBase();
  const hasCircles = useHasCircles();
  const [currentOrgId, setCurrentOrgId] = useCurrentOrgId();

  useEffect(() => {
    if (orgs?.length && !currentOrgId) {
      setCurrentOrgId(orgs[0].id);
    }
  }, [orgs]);

  const goToCircle = (id: number, path: string) => {
    setCurrentOrgId(orgs?.find(o => o.circles.some(c => c.id === id))?.id);
    selectAndFetchCircle(id).then(() => {
      navigate(path);
    });
  };

  return (
    <>
      <Link
        css={headerLinkStyle}
        onClick={event => setAnchorEl(event.currentTarget)}
        className={paths.circles?.includes(location.pathname) ? 'active' : ''}
        href="#"
      >
        Overview
        <Box css={{ marginLeft: '$xs', display: 'flex' }}>
          <ChevronDownSVG />
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
              pt: '$sm',
              '> *': { padding: '$xs $md' },
              '> a': {
                color: '$text',
                '&:hover': { color: '$black' },
              },
            }}
          >
            <Link
              css={{
                fontSize: '$5',
                mb: '$md',
                display: 'flex',
                alignItems: 'center',
                svg: {
                  fill: '$text',
                },
              }}
            >
              Overview
              <Box css={{ marginLeft: '$xs', display: 'flex' }}>
                <ChevronUpSVG />
              </Box>
            </Link>
            {hasCircles && <TopLevelLinks links={mainLinks} />}
            {orgs?.map(org => (
              <Box key={org.id} css={{ mb: '$lg' }}>
                <Box
                  css={{ display: 'flex', mb: '$sm', alignItems: 'flex-start' }}
                >
                  <Text
                    variant="formLabel"
                    css={{ flexGrow: 1, fontSize: '$2' }}
                  >
                    {org.name}
                  </Text>
                </Box>
                <Box
                  css={{ display: 'flex', flexDirection: 'column', gap: '$sm' }}
                >
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

const headerLinkStyle = {
  my: 0,
  mx: '$xs',
  fontSize: '$5',
  color: '$white',
  borderRadius: '$pill',
  textDecoration: 'none',
  px: '$md',
  py: '$xs',
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  svg: {
    fill: '$white',
  },
  '&:hover': {
    backgroundColor: '$secondaryText',
  },
  '&.active': {
    backgroundColor: '$focusedBorder',
    color: '$text',
    svg: {
      fill: '$text',
    },
  },
};

const linkStyle = {
  my: 0,
  fontSize: '$5',
  color: '$text',
  '&:hover': {
    color: '$link',
  },
};

export const TopLevelLinks = ({
  links,
  css = {},
}: {
  links: [string, string, string[]?][];
  css?: CSS;
}) => {
  const location = useLocation();

  return (
    <Box
      css={{
        display: 'flex',
        flexDirection: 'column',
        marginBottom: '$lg',
        ...css,
      }}
    >
      {links.map(([path, label, matchPaths]) => (
        <Link
          css={linkStyle}
          as={NavLink}
          key={path}
          to={path}
          className={matchPaths?.includes(location.pathname) ? 'active' : ''}
        >
          {label}
        </Link>
      ))}
    </Box>
  );
};

const CircleItem = ({ circle, onButtonClick }: CircleItemProps) => {
  const role = circle.users[0]?.role;
  const nonMember = role === undefined;
  return (
    <Link
      css={{
        fontSize: '$5',
        color: '$text',
        '&:hover': {
          color: '$link',
        },
      }}
      onClick={() => !nonMember && onButtonClick(circle.id, paths.history)}
    >
      {circle.name}
    </Link>
  );
};
