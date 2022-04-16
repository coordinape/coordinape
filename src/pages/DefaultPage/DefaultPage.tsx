import React, { ReactNode } from 'react';

import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { useNavigate } from 'react-router-dom';
import { useRecoilValueLoadable } from 'recoil';

import { makeStyles, Button } from '@material-ui/core';

import { rSelectedCircle, useAuthToken, rMyProfile } from 'recoilState/app';
import {
  paths,
  EXTERNAL_URL_DISCORD,
  EXTERNAL_URL_DOCS,
  EXTERNAL_URL_LANDING_PAGE,
  EXTERNAL_URL_TWITTER,
} from 'routes/paths';
import { Box } from 'ui';

const useStyles = makeStyles(theme => ({
  root: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
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
  const navigate = useNavigate();
  const web3Context = useWeb3React<Web3Provider>();

  const authToken = useAuthToken();
  const myProfile = useRecoilValueLoadable(rMyProfile).valueMaybe();
  const selectedCircle = useRecoilValueLoadable(rSelectedCircle).valueMaybe();

  const Wrapper = ({ children }: { children: ReactNode }) => (
    <Box
      css={{
        maxWidth: '700px',
        mx: 'auto',
        pt: '$2xl',
        px: '$lg',
        textAlign: 'center',
      }}
    >
      {children}
      <Footer />
    </Box>
  );

  // TODO: Split these off into separate components..
  // But also Alex Ryan likes the idea of us making this more useful.
  if (!authToken) {
    return (
      <Wrapper>
        <p className={classes.title}>Reward Your Fellow Contributors</p>
        <p className={classes.subTitle}>
          {!web3Context.account
            ? 'Connect your wallet to participate.'
            : 'Login to Coordinape'}
        </p>
      </Wrapper>
    );
  }
  // still loading
  if (!myProfile) return null;

  if (!selectedCircle) {
    return (
      <Wrapper>
        <p className={classes.title}>Welcome!</p>
        <div className={classes.welcomeSection}>
          <p className={classes.welcomeText}>
            This wallet isn&apos;t associated with a circle.
          </p>
          <p className={classes.welcomeText}>
            If you are supposed to be part of a circle already, contact your
            circle&apos;s admin to make sure they added this address:{' '}
            {myProfile.address}
          </p>
          <p className={classes.welcomeText}>Or, create a new circle.</p>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate(paths.createCircle)}
            className={classes.startCircle}
          >
            Start a Circle
          </Button>
        </div>
      </Wrapper>
    );
  }

  return (
    // FIXME this is basically unreachable because
    <Wrapper>
      <p className={classes.title}>Welcome to {selectedCircle.circle.name}!</p>
    </Wrapper>
  );
};

const Footer = () => (
  <Box
    css={{
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      pt: '$2xl',
      pb: '$xl',
      '> a': {
        padding: '$md 0',
        color: '$primary',
        textDecoration: 'none',
        fontWeight: '$bold',
        fontSize: '$6',
      },
    }}
  >
    <a target="_blank" rel="noreferrer" href={EXTERNAL_URL_LANDING_PAGE}>
      coordinape.com
    </a>
    <a target="_blank" rel="noreferrer" href={EXTERNAL_URL_DISCORD}>
      Discord
    </a>
    <a target="_blank" rel="noreferrer" href={EXTERNAL_URL_TWITTER}>
      Twitter
    </a>
    <a target="_blank" rel="noreferrer" href={EXTERNAL_URL_DOCS}>
      Docs
    </a>
  </Box>
);

export default DefaultPage;
