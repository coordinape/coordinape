import { makeStyles } from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles((theme) => ({
  root: {
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingTop: 70,
    maxWidth: '80%',
    textAlign: 'center',
  },
  title: {
    fontSize: 54,
    fontWeight: 700,
    color: theme.colors.primary,
    margin: 0,
  },
  subTitle: {
    padding: '7px 32px',
    fontSize: 27,
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
      <p className={classes.title}>Who have you been working with recently?</p>
      <p className={classes.subTitle}>
        Select your teammates so you can thank them with GIVE
      </p>
    </div>
  );
};
