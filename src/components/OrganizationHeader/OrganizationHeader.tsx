import { useState, useEffect } from 'react';

import { NavLink, useLocation } from 'react-router-dom';

import { makeStyles, Button, Avatar } from '@material-ui/core';

import { useMe } from 'hooks';
import { DownArrow } from 'icons';
import AdminUserModal from 'pages/OverviewPage/AdminUserModal';
import { getAdminNavigation, checkActive } from 'routes/paths';

const useStyles = makeStyles(theme => ({
  morePaper: {
    width: 170,
    padding: theme.spacing(1, 0),
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: 8,
    background:
      'linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(223, 237, 234, 0.4) 40.1%), linear-gradient(180deg, rgba(237, 253, 254, 0.4) 0%, rgba(207, 231, 233, 0) 100%), #FFFFFF',
    boxShadow: '0px 4px 6px rgba(181, 193, 199, 0.16)',
  },
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
  organizationLink: {
    margin: theme.spacing(0, 2),
    fontSize: 20,
    fontWeight: 700,
    color: theme.colors.white,
    textDecoration: 'none',
    padding: '6px 0',
    position: 'relative',
    '&::after': {
      content: `" "`,
      position: 'absolute',
      left: '50%',
      right: '50%',
      backgroundColor: theme.colors.mediumRed,
      transition: 'all 0.3s',
      bottom: 0,
      height: 2,
    },
    '&:hover': {
      '&::after': {
        left: 0,
        right: 0,
        backgroundColor: theme.colors.mediumRed,
      },
    },
    '&.active': {
      '&::after': {
        left: 0,
        right: 0,
        backgroundColor: theme.colors.red,
      },
      '&:hover': {
        '&::after': {
          left: 0,
          right: 0,
          backgroundColor: theme.colors.red,
        },
      },
    },
  },
  navLinks: {
    justifySelf: 'stretch',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  buttons: {
    justifySelf: 'end',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  navLink: {
    margin: theme.spacing(0, 2),
    fontSize: 20,
    fontWeight: 400,
    color: theme.colors.mediumGray,
    textDecoration: 'none',
    padding: theme.spacing(1, 2),
    position: 'relative',
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
    margin: theme.spacing(6, 0),
  },
  moreButton: {
    margin: 0,
    padding: theme.spacing(0, 1),
    minWidth: 20,
    fontSize: 17,
    fontWeight: 800,
    color: theme.colors.text,
  },
}));

export const OrganizationHeader = () => {
  const location = useLocation();
  const classes = useStyles();

  const { selectedMyUser, hasAdminView } = useMe();
  const navButtonsVisible = !!selectedMyUser || hasAdminView;
  const navItems = getAdminNavigation();
  const [, setEditCircle] = useState<boolean>(false);
  // const [,setNewUser] = useState<boolean>(false);
  const [fundModalOpen, setFundModalOpen] = useState<boolean>(false);
  const [, setPath] = useState<string>('');
  const [isCirclePage, setIsCirclePage] = useState<boolean>(false);
  useEffect(() => {
    setPath(location.pathname);
    if (location.pathname === '/admin/circles') {
      setIsCirclePage(true);
    }
  }, [location]);

  const handleClose = () => {
    setFundModalOpen(!fundModalOpen);
  };

  const handleButtonClick = () => {
    if (!isCirclePage) {
      setEditCircle(true);
    } else {
      // Open add circle modal
    }
  };
  return (
    <>
      <div className={classes.topMenu}>
        <AdminUserModal onClose={handleClose} open={fundModalOpen} />
        <div className={classes.organizationLinks}>
          <Avatar
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
          <h2 className={classes.title}>Yearn Finance</h2>
          <Button
            aria-describedby="1"
            className={classes.moreButton}
            onClick={() => setEditCircle(true)}
          >
            <DownArrow />
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={handleButtonClick}
            color="primary"
            style={{
              marginLeft: '27px',
            }}
          >
            {isCirclePage ? 'Add Circle' : 'Create a Vault'}
          </Button>
        </div>
        <div className={classes.navLinks}>
          {navButtonsVisible &&
            navItems.map(navItem => (
              <NavLink
                className={classes.navLink}
                activeStyle={{
                  backgroundColor: '#EFF3F4',
                  borderRadius: '16px',
                  color: '#516369',
                }}
                isActive={(nothing, location) =>
                  checkActive(location.pathname, navItem)
                }
                key={navItem.path}
                to={navItem.path}
              >
                {navItem.label}
              </NavLink>
            ))}
        </div>
      </div>
    </>
  );
};
