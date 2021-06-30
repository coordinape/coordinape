import React from 'react';

import clsx from 'clsx';
import { NavLink } from 'react-router-dom';

import { Popover, makeStyles, Avatar, Divider } from '@material-ui/core';

import { useMe, useCircle } from 'hooks';
import * as paths from 'routes/paths';

const useStyles = makeStyles((theme) => ({
  avatarButton: {
    marginLeft: theme.spacing(1.5),
    height: '50px',
    width: '50px',
    cursor: 'pointer',
    border: '3px solid rgba(239, 115, 118, 0)',
    '&.selected': {
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
    margin: theme.spacing(0.5, 0, 0.5, 6),
    fontSize: 13,
    lineHeight: 1.5,
    fontWeight: 600,
  },
  link: {
    position: 'relative',
    margin: theme.spacing(0, 0, 0, 6),
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
    '&:selected': {
      color: theme.colors.red,
    },
  },
  selectedLink: {
    '&::before': {
      content: '" "',
      position: 'absolute',
      top: '12px',
      left: '-16px',
      width: '8px',
      height: '8px',
      backgroundColor: theme.colors.red,
      borderRadius: '50%',
    },
  },
}));

export const MyAvatarMenu = () => {
  const classes = useStyles();
  const { selectedMyUser, myCircles, avatarPath } = useMe();
  const { selectCircle, selectedCircleId } = useCircle();

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
      <Avatar
        src={avatarPath}
        alt={selectedMyUser?.name}
        onClick={handleClick}
        className={
          !anchorEl
            ? classes.avatarButton
            : clsx(classes.avatarButton, 'selected')
        }
      />
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
        <NavLink to={paths.getProfilePath('me')} className={classes.link}>
          Profile
        </NavLink>
        <NavLink to={paths.getMyEpochPath()} className={classes.link}>
          My Epoch
        </NavLink>
        <NavLink to={paths.getMyTeamPath()} className={classes.link}>
          My Team
        </NavLink>
        <NavLink to={paths.getHistoryPath()} className={classes.link}>
          History
        </NavLink>
        <Divider variant="middle" className={classes.divider} />
        <span className={classes.subHeader}>Switch Circles</span>
        {myCircles.map((circle) => (
          <button
            className={
              selectedCircleId === circle.id
                ? clsx(classes.link, classes.selectedLink)
                : classes.link
            }
            key={circle.name}
            onClick={() => {
              setAnchorEl(null);
              selectCircle(circle.id);
            }}
          >
            {circle.name}
          </button>
        ))}
      </Popover>
    </>
  );
};
