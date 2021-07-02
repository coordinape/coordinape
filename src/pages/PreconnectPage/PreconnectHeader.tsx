import React, { Suspense } from 'react';

import { useRecoilValue, useSetRecoilState } from 'recoil';

import { makeStyles } from '@material-ui/core';

import { rMyAddress, rCircleSelectorOpen, rSelectedCircle } from 'recoilState';

const useStyles = makeStyles((theme) => ({
  root: {
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingTop: 70,
    maxWidth: '60%',
    textAlign: 'center',
  },
  title: {
    fontSize: 54,
    fontWeight: 700,
    color: theme.colors.primary,
    margin: 0,
  },
  subTitle: {
    margin: 0,
    padding: theme.spacing(0, 5),
    fontSize: 30,
    fontWeight: 400,
    color: theme.colors.primary,
  },
  subTitleLink: {
    fontSize: 30,
    fontWeight: 400,
    color: theme.colors.primary,
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    textDecoration: 'underline',
    display: 'inline',
    margin: 0,
    padding: theme.spacing(0, 5),
  },
  description: {
    margin: 0,
    padding: theme.spacing(0, 5),
    fontSize: 16,
    fontWeight: 400,
    color: theme.colors.primary,
  },
  warning: {
    marginBottom: 32,
    fontSize: 24,
    fontWeight: 500,
    color: theme.colors.secondary,
    margin: 0,
  },
}));

const Welcome = () => {
  const classes = useStyles();

  const selectedCircle = useRecoilValue(rSelectedCircle);
  const setCircleSelectorOpen = useSetRecoilState(rCircleSelectorOpen);

  return (
    <>
      <p className={classes.title}>
        {selectedCircle === undefined
          ? 'Welcome!'
          : `Welcome to ${selectedCircle.name}!`}
      </p>
      {selectedCircle === undefined ? (
        <button
          className={classes.subTitleLink}
          onClick={() => setCircleSelectorOpen(true)}
        >
          Select a circle to begin
        </button>
      ) : null}
    </>
  );
};

const Generic = () => {
  const classes = useStyles();

  return (
    <>
      <p className={classes.title}>Reward Your Fellow Contributors</p>
      <p className={classes.subTitle}>
        Connect your wallet to participate. You must be registered as a
        contributor with an existing Coordinape project
      </p>
    </>
  );
};

export const PreconnectHeader = () => {
  const classes = useStyles();
  const myAddress = useRecoilValue(rMyAddress);

  return (
    <div className={classes.root}>
      {myAddress ? (
        <Suspense fallback={<Generic />}>
          <Welcome />
        </Suspense>
      ) : (
        <Generic />
      )}
    </div>
  );
};

export default PreconnectHeader;
