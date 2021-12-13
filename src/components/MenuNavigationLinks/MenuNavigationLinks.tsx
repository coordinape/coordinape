import { NavLink } from 'react-router-dom';

import { makeStyles } from '@material-ui/core';

import * as paths from 'routes/paths';

const useStyles = makeStyles(theme => ({
  link: {
    position: 'relative',
    margin: theme.spacing(0, 0, 0, 5),
    padding: 0,
    textAlign: 'left',
    fontSize: 18,
    lineHeight: 1.6,
    color: theme.colors.text,
    fontWeight: 300,
    textDecoration: 'none',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontFamily: theme.typography.fontFamily,
    '&:hover': {
      color: theme.colors.black,
    },
    [theme.breakpoints.down('sm')]: {
      margin: 0,
      padding: '6px 0',
      fontSize: 20,
      color: theme.colors.text,
      fontWeight: 'normal',
    },
  },
}));

export const MenuNavigationLinks = (props: { handleOnClick?(): void }) => {
  const classes = useStyles();

  return (
    <>
      {paths.getMenuNavigation().map(({ label, path, isExternal }) => {
        if (isExternal) {
          return (
            <div key={path}>
              <a
                className={classes.link}
                href={path}
                rel="noreferrer"
                target="_blank"
              >
                {label}
              </a>
            </div>
          );
        }
        return (
          <NavLink
            key={path}
            to={path}
            className={classes.link}
            onClick={props.handleOnClick}
          >
            {label}
          </NavLink>
        );
      })}
    </>
  );
};
