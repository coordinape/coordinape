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
    [theme.breakpoints.up('sm')]: {
      lineHeight: 1.6,
    },
    [theme.breakpoints.down('sm')]: {
      margin: 0,
      padding: '4px 0',
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
            <a
              key={path}
              className={classes.link}
              href={path}
              rel="noreferrer"
              target="_blank"
            >
              {label}
            </a>
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
