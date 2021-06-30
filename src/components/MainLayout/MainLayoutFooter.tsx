import React from 'react';

import { Button, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    height: theme.custom.appFooterHeight,
    display: 'flex',
    justifyContent: 'center',
    padding: `0 ${theme.spacing(4)}px`,
    alignItems: 'center',
    position: 'fixed',
    left: 0,
    right: 0,
    bottom: 0,
    [theme.breakpoints.down('xs')]: {
      padding: `0 ${theme.spacing(2)}px`,
    },
    background: theme.colors.primary,
  },
  balance: {
    fontSize: 40,
    color: theme.colors.white,
  },
  balanceNumber: {
    fontWeight: 600,
  },
  description: {
    marginLeft: 16,
    fontSize: 20,
    color: theme.colors.white,
  },
  saveButton: {
    marginLeft: 44,
    height: 35,
    padding: '0px 37px',
    borderRadius: 8,
    background: theme.colors.selected,
    fontSize: 18,
    fontWeight: 600,
    color: theme.colors.white,
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.7)',
    },
  },
}));

interface IProps {
  className?: string;
}

export const MainLayoutFooter = (props: IProps) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <p className={classes.balance}>
        <span className={classes.balanceNumber}>25</span> of{' '}
        <span className={classes.balanceNumber}>100</span>
      </p>
      <p className={classes.description}>GIVE Allocated</p>
      <Button className={classes.saveButton}>Save Allocations</Button>
    </div>
  );
};

export default MainLayoutFooter;
