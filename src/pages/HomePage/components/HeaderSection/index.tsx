import { makeStyles } from '@material-ui/core';
import { useUserInfo } from 'contexts';
import moment from 'moment';
import React, { useEffect, useState } from 'react';

const useStyles = makeStyles((theme) => ({
  root: {
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingTop: 70,
    maxWidth: '70%',
    textAlign: 'center',
  },
  title: {
    fontSize: 54,
    fontWeight: 700,
    color: theme.colors.primary,
    margin: 0,
  },
  subTitle: {
    padding: '0 32px',
    fontSize: 30,
    fontWeight: 400,
    color: theme.colors.primary,
    margin: 0,
  },
  description: {
    padding: '0 100px',
    fontSize: 16,
    fontWeight: 400,
    color: theme.colors.primary,
    margin: 0,
  },
  warning: {
    marginBottom: 32,
    fontSize: 24,
    fontWeight: 500,
    color: theme.colors.secondary,
    margin: 0,
  },
}));

interface IProps {
  className?: string;
}

export const HeaderSection = (props: IProps) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <p className={classes.title}>Reward Yearn Contributors</p>
      <p className={classes.subTitle}>
        You must be a current contributor and connect your wallet to participate
      </p>
    </div>
  );
};
