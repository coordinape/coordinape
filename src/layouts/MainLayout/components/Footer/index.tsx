import { Button, makeStyles } from '@material-ui/core';
import { transparentize } from 'polished';
import React from 'react';

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
    background: '#5E6F74',
  },
  balance: {
    fontSize: 40,
    color: 'white',
  },
  balanceNumber: {
    fontWeight: 600,
  },
  description: {
    marginLeft: 16,
    fontSize: 20,
    color: 'white',
  },
  saveButton: {
    marginLeft: 44,
    height: 35,
    padding: '0px 37px',
    borderRadius: 8,
    background: '#31A5AC',
    fontSize: 18,
    fontWeight: 600,
    color: 'white',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.7)',
    },
  },
}));

interface IProps {
  className?: string;
}

export const Footer = (props: IProps) => {
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
