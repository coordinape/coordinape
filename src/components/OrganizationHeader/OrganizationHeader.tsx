import { NavLink } from 'react-router-dom';

import { makeStyles } from '@material-ui/core';

import { ApeAvatar } from 'components';
import { useCurrentOrg } from 'hooks/gql';
import { getAdminNavigation } from 'routes/paths';
import { Box } from 'ui';

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(0.5, 0),
    fontSize: 16,
    color: theme.colors.text,
  },
  topMenu: {
    height: 120,
    display: 'grid',
    alignItems: 'center',
    gridTemplateColumns: '1fr 1fr',
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(0, 2),
      gridTemplateColumns: '1fr 1fr',
    },
    '& > *': {
      alignSelf: 'center',
    },
    '& .MuiSkeleton-root': {
      marginLeft: theme.spacing(1.5),
    },
    '& .MuiSkeleton-rect': {
      borderRadius: 5,
    },
  },
  organizationLinks: {
    justifySelf: 'stretch',
    display: 'flex',
    justifyContent: 'left',
    alignItems: 'center',
  },
  navLinks: {
    justifySelf: 'stretch',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  navLink: {
    margin: theme.spacing(0, 2),
    fontSize: 20,
    fontWeight: 400,
    color: theme.colors.mediumGray,
    textDecoration: 'none',
    padding: theme.spacing(1, 2),
    position: 'relative',
    '&.active': {
      backgroundColor: '#EFF3F4',
      borderRadius: '16px',
      color: '#516369',
    },
    '&:hover': {
      backgroundColor: theme.colors.ultraLightGray,
      padding: theme.spacing(1, 2),
      borderRadius: '16px',
      color: theme.colors.text,
      '&::after': {
        left: 0,
        right: 0,
        backgroundColor: theme.colors.ultraLightGray,
      },
    },
  },
  title: {
    textTransform: 'capitalize',
    fontSize: 24,
    lineHeight: 1.2,
    fontWeight: 700,
    color: theme.colors.text,
    margin: theme.spacing(5, 0),
  },
}));

export const OrganizationHeader = () => {
  const classes = useStyles();
  const navItems = getAdminNavigation();
  const currentOrg = useCurrentOrg();

  return (
    <>
      <Box
        css={{
          display: 'flex',
        }}
      >
        <Box css={{ flexGrow: 1 }} className={classes.organizationLinks}>
          <ApeAvatar
            alt="organization"
            src="/imgs/avatar/placeholder.jpg"
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              border: '1px solid rgba(94, 111, 116, 0.7)',
              marginRight: '16px',
            }}
          />
          <h2 className={classes.title}>{currentOrg?.name}</h2>
        </Box>
        <div className={classes.navLinks}>
          {navItems.map(navItem => (
            <NavLink
              className={classes.navLink}
              key={navItem.path}
              to={navItem.path}
            >
              {navItem.label}
            </NavLink>
          ))}
        </div>
      </Box>
    </>
  );
};
