import React from 'react';

import clsx from 'clsx';
import { NavLink } from 'react-router-dom';
import { useRecoilValueLoadable } from 'recoil';

import { Popover, makeStyles, Divider, Hidden } from '@material-ui/core';

import { CirclesHeaderSection, ApeAvatar } from 'components';
import { useMyProfile, rSelectedCircle } from 'recoilState/app';
import { useSetCircleSelectorOpen } from 'recoilState/ui';
import * as paths from 'routes/paths';

const useStyles = makeStyles(theme => ({
  avatarButton: {
    marginLeft: theme.spacing(1.5),
    height: '50px',
    width: '50px',
    cursor: 'pointer',
    border: '3px solid #828F93',
    transition: 'border-color .3s ease',
    '&.selected': {
      border: '3px solid rgba(239, 115, 118, 1)',
    },
    '&:hover': {
      border: '3px solid rgba(239, 115, 118, 1)',
    },
  },
  popover: {
    width: 237,
    marginTop: theme.spacing(0.5),
    padding: theme.spacing(2, 0),
    borderRadius: 8,
    background:
      'linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(223, 237, 234, 0.4) 40.1%), linear-gradient(180deg, rgba(237, 253, 254, 0.4) 0%, rgba(207, 231, 233, 0) 100%), #FFFFFF',
    boxShadow: '0px 4px 6px rgba(181, 193, 199, 0.16)',
    display: 'flex',
    flexDirection: 'column',
  },
  divider: {
    alignSelf: 'stretch',
    background: theme.colors.text,
    opacity: 0.25,
    margin: theme.spacing(2, 1),
  },
  subHeader: {
    margin: theme.spacing(0.5, 0, 0.5, 5),
    fontSize: 13,
    lineHeight: 1.5,
    fontWeight: 600,
  },
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
    [theme.breakpoints.down('xs')]: {
      margin: 0,
      padding: '6px 0',
      fontSize: 20,
      color: theme.colors.text,
      fontWeight: 'normal',
    },
  },
  selectedLink: {
    '&::before': {
      content: '" "',
      position: 'absolute',
      top: '11px',
      left: '-16px',
      width: '8px',
      height: '8px',
      backgroundColor: theme.colors.red,
      borderRadius: '50%',
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

export const MyAvatarMenu = () => {
  const classes = useStyles();
  const myProfile = useMyProfile();
  const { hasAdminView } = myProfile;
  const setCircleSelectorOpen = useSetCircleSelectorOpen();
  const selectedCircle = useRecoilValueLoadable(rSelectedCircle).valueMaybe();

  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <ApeAvatar
        profile={myProfile}
        onClick={handleClick}
        className={
          !anchorEl
            ? classes.avatarButton
            : clsx(classes.avatarButton, 'selected')
        }
      />
      <Hidden xsDown>
        <Popover
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          classes={{
            paper: classes.popover,
          }}
          id="my-avatar-popover"
          onClose={handleClose}
          open={open}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
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
                onClick={() => setAnchorEl(null)}
              >
                {label}
              </NavLink>
            );
          })}
          <Divider variant="middle" className={classes.divider} />
          <span className={classes.subHeader}>Switch Circles</span>
          <CirclesHeaderSection handleOnClick={() => setAnchorEl(null)} />
          {hasAdminView && (
            <>
              <Divider variant="middle" className={classes.divider} />
              <span className={classes.subHeader}>Admin View</span>
              {selectedCircle && selectedCircle.impersonate ? (
                <>
                  <button
                    className={clsx(classes.link, classes.selectedLink)}
                    onClick={() => setAnchorEl(null)}
                  >
                    {selectedCircle.circle.name}
                  </button>
                  <button
                    className={classes.link}
                    onClick={() => {
                      setAnchorEl(null);
                      setCircleSelectorOpen(true);
                    }}
                  >
                    Circle Selector
                  </button>
                </>
              ) : (
                <button
                  className={classes.link}
                  onClick={() => {
                    setAnchorEl(null);
                    setCircleSelectorOpen(true);
                  }}
                >
                  Circle Selector
                </button>
              )}
            </>
          )}
        </Popover>
      </Hidden>
    </>
  );
};
