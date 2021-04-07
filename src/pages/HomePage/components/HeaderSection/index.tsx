import { makeStyles } from '@material-ui/core';
import React from 'react';
import { isSubdomainAddress, subdomain } from 'utils/domain';

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

export const HeaderSection = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      {isSubdomainAddress() ? (
        <>
          <p className={classes.title}>Reward {subdomain()} Contributors</p>
          <p className={classes.subTitle}>
            Connect your wallet to participate. You must be registered as a
            contributor with an existing Coordinape project
          </p>
          <p className={classes.description}>
            You may need to authenticate your wallet again when switching
            circles for the first time
          </p>
        </>
      ) : (
        <>
          <p className={classes.title}>Reward Your Fellow Contributors</p>
          <p className={classes.subTitle}>
            Connect your wallet to participate. You must be registered as a
            contributor with an existing Coordinape project
          </p>
        </>
      )}
    </div>
  );
};
