import React, { useState, useEffect } from 'react';

import { Button, makeStyles } from '@material-ui/core';

import { useValSelectedCircle } from 'recoilState';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(5, 0),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  title: {
    margin: theme.spacing(1),
    fontSize: 40,
    fontWeight: 700,
    color: theme.colors.primary,
  },
  description: {
    margin: theme.spacing(1),
    fontSize: 20,
    fontWeight: 400,
    color: theme.colors.primary,
    textAlign: 'center',
  },
  nominateButton: {
    margin: theme.spacing(8, 2),
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(1, 3),
    fontSize: 19.5,
    lineHeight: 1.75,
    fontWeight: 600,
    textTransform: 'none',
    color: theme.colors.white,
    background: theme.colors.red,
    borderRadius: 13,
    '&.MuiButton-root:hover': {
      background: theme.colors.darkRed,
    },
  },
  subTitle: {
    maxWidth: theme.breakpoints.values.md,
    fontSize: 20,
    fontWeight: 400,
    color: theme.colors.primary,
    textAlign: 'center',
  },
  hrWithMax: {
    height: 1,
    width: '100%',
    maxWidth: theme.breakpoints.values.md,
    color: theme.colors.primary,
    opacity: 0.5,
  },
}));

export const VouchingPage = () => {
  const classes = useStyles();
  const circle = useValSelectedCircle();

  return !circle ? (
    <div className={classes.root}></div>
  ) : (
    <div className={classes.root}>
      <h2 className={classes.title}>Add Circle Members</h2>
      <p className={classes.description}>
        Think someone new should be added to the {circle.name} circle?
        <br />
        Nominate or vouch for them here.
      </p>
      <Button className={classes.nominateButton}>Nominate New Member</Button>
      <span className={classes.subTitle}>Recently Nominated</span>
      <hr className={classes.hrWithMax} />
    </div>
  );
};

export default VouchingPage;
