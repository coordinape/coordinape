import React from 'react';

import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { useHistory } from 'react-router-dom';
import { useRecoilValueLoadable } from 'recoil';

import { makeStyles, Button } from '@material-ui/core';

import { LoadingScreen } from 'components';
import { rSelectedCircle, useAuthToken, rMyProfile } from 'recoilState/app';
import { useHasCircles } from 'recoilState/db';
import { getNavigationFooter } from 'routes/paths';
import * as paths from 'routes/paths';
import { shortenAddress } from 'utils';

const useStyles = makeStyles(theme => ({
  root: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  header: {
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingTop: 70,
    maxWidth: '60%',
    textAlign: 'center',
  },
  title: {
    fontSize: 34,
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
  welcomeSection: {
    width: '100%',
    maxWidth: 480,
    textAlign: 'left',
    display: 'flex',
    flexDirection: 'column',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 400,
    color: theme.colors.text,
  },
  startCircle: {
    margin: 'auto',
    marginTop: theme.spacing(3),
  },
  footer: {
    width: '100%',
    display: 'grid',
    gridTemplateColumns: '150px 150px 150px 150px',
    padding: theme.spacing(8),
    justifyContent: 'center',
    '& > *': {
      textAlign: 'center',
    },
    [theme.breakpoints.down('sm')]: {
      gridTemplateColumns: '1fr 1fr',
      gridTemplateRows: '40px 40px',
    },
  },
  link: {
    position: 'relative',
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: 600,
    textDecoration: 'none',
    '&::after': {
      content: `" "`,
      position: 'absolute',
      left: '50%',
      right: '50%',
      backgroundColor: theme.colors.primary,
      transition: 'all 0.3s',
      bottom: 0,
      height: 2,
    },
    '&:hover': {
      '&::after': {
        left: 0,
        right: 0,
        backgroundColor: theme.colors.primary,
      },
    },
  },
}));

export const DefaultPage = () => {
  const classes = useStyles();
  const history = useHistory();
  const web3Context = useWeb3React<Web3Provider>();

  const authToken = useAuthToken();
  const myProfile = useRecoilValueLoadable(rMyProfile).valueMaybe();
  const selectedCircle = useRecoilValueLoadable(rSelectedCircle).valueMaybe();
  const hasCircles = useHasCircles();

  // TODO: Split these off into separate components..
  // But also Alex Ryan likes the idea of us making this more useful.
  if (!authToken) {
    return (
      <div className={classes.root}>
        <div className={classes.header}>
          <p className={classes.title}>Reward Your Fellow Contributors</p>
          <p className={classes.subTitle}>
            {!web3Context.account
              ? 'Connect your wallet to participate.'
              : 'Login to Coordinape'}
          </p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!myProfile) {
    return <LoadingScreen />;
  }

  // TODO: This is an edge case, if the server doesn't return a circle
  // https://github.com/coordinape/coordinape-backend/issues/69
  if (hasCircles && !selectedCircle) {
    return (
      <div className={classes.root}>
        <div className={classes.header}>
          <p className={classes.title}>Welcome!</p>
          <div className={classes.welcomeSection}>
            <p className={classes.welcomeText}>
              Select a circle to begin from the avatar menu in the top right.
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!selectedCircle) {
    return (
      <div className={classes.root}>
        <div className={classes.header}>
          <p className={classes.title}>Welcome!</p>
          <div className={classes.welcomeSection}>
            <p className={classes.welcomeText}>
              This wallet isn&apos;t associated with a circle.
            </p>
            <p className={classes.welcomeText}>
              If you are supposed to be part of a circle already, contact your
              circle&apos;s admin to make sure they added this address:{' '}
              {shortenAddress(myProfile.address)}
            </p>
            <p className={classes.welcomeText}>Or, create a new circle.</p>
            <Button
              variant="contained"
              color="primary"
              onClick={() => history.push(paths.getCreateCirclePath())}
              className={classes.startCircle}
            >
              Start a Circle
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <p className={classes.title}>
          Welcome to {selectedCircle.circle.name}!
        </p>
      </div>
      <Footer />
    </div>
  );
};

const Footer = () => {
  const classes = useStyles();

  return (
    <div className={classes.footer}>
      {getNavigationFooter().map(({ path, label }) => (
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
      ))}
    </div>
  );
};
export default DefaultPage;
