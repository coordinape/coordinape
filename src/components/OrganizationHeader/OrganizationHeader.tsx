import { NavLink } from 'react-router-dom';

import { makeStyles, Button } from '@material-ui/core';

import { ApeAvatar } from 'components';
import { DownArrow } from 'icons';
import { useMyProfile, useSelectedCircle } from 'recoilState/app';
import { getAdminNavigation, checkActive } from 'routes/paths';

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
    margin: theme.spacing(6, 0),
  },
  moreButton: {
    margin: 0,
    padding: 0,
    minWidth: 20,
    fontSize: 17,
    fontWeight: 800,
    color: theme.colors.text,
  },
  moreButtonIcon: {
    marginTop: theme.spacing(2),
    marginLeft: theme.spacing(1),
  },
}));

interface Props {
  name?: string;
  buttonText: string;
  onButtonClick: () => void;
}
export const OrganizationHeader = ({
  name,
  buttonText,
  onButtonClick,
}: Props) => {
  const classes = useStyles();

  const { myUser } = useSelectedCircle();
  const { hasAdminView } = useMyProfile();

  const navButtonsVisible = !!myUser || hasAdminView;
  const navItems = getAdminNavigation();

  return (
    <>
      <div className={classes.topMenu}>
        <div className={classes.organizationLinks}>
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
          <h2 className={classes.title}>{name || 'Organization name'}</h2>
          <Button aria-describedby="1" className={classes.moreButton}>
            <DownArrow className={classes.moreButtonIcon} />
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={onButtonClick}
            color="primary"
            style={{
              marginLeft: '27px',
            }}
          >
            {buttonText}
          </Button>
        </div>
        <div className={classes.navLinks}>
          {navButtonsVisible &&
            navItems.map(navItem => (
              <NavLink
                className={classes.navLink}
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
