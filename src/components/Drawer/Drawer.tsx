import React from 'react';

import clsx from 'clsx';

import { makeStyles, IconButton } from '@material-ui/core';
import MuiDrawer from '@material-ui/core/Drawer';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@material-ui/icons';

const useStyles = makeStyles(theme => ({
  root: {},
  paper: {
    position: 'absolute',
    backgroundColor: theme.colors.surface,
    boxShadow: '2px 3px 6px rgba(81, 99, 105, 0.5)',
    display: 'flex',
    alignItems: 'stretch',
    transition: 'width .4s ease',
    border: 0,
  },
  open: {
    width: theme.custom.appDrawerWidth,
    maxWidth: '95vw',
  },
  closed: {
    width: 47,
  },
  content: {
    flexGrow: 1,
    overflowX: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  icon: {
    flexGrow: 1,
    paddingTop: theme.spacing(1.5),
    opacity: 0.5,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    cursor: 'pointer',
  },
  toggleButton: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 50,
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: theme.spacing(2, 1.5),
  },
  right: {
    '& $toggleButton': {
      justifyContent: 'flex-start',
    },
  },
}));

interface IProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  children: React.ReactNode;
  Icon?: React.ReactNode;
  anchorRight?: boolean;
}

export const Drawer = ({
  open,
  setOpen,
  children,
  Icon,
  anchorRight = false,
}: IProps) => {
  const classes = useStyles();

  return (
    <MuiDrawer
      open
      onClose={() => setOpen(false)}
      classes={{
        root: classes.root,
        paper: clsx(classes.paper, {
          [classes.open]: open,
          [classes.closed]: !open,
          [classes.right]: anchorRight,
        }),
      }}
      variant="persistent"
      anchor={anchorRight ? 'right' : 'left'}
    >
      {open ? (
        <div className={classes.content}>{children}</div>
      ) : (
        <div className={classes.icon} onClick={() => setOpen(!open)}>
          {Icon}
        </div>
      )}
      {open && (
        <div className={classes.toggleButton}>
          <IconButton
            color="inherit"
            onClick={() => setOpen(false)}
            size="small"
          >
            {anchorRight ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
          </IconButton>
        </div>
      )}
    </MuiDrawer>
  );
};
