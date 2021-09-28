import React from 'react';

import { useHistory } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

import { makeStyles, Button } from '@material-ui/core';

import { rMyAddress, rSelectedCircle } from 'recoilState';
import { getNavigationFooter, EXTERNAL_URL_DISCORD } from 'routes/paths';
import * as paths from 'routes/paths';

const useStyles = makeStyles((theme) => ({
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
    marginTop: theme.spacing(5),
  },
  skeletonRoot: {
    marginTop: 60,
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingTop: 48,
    paddingLeft: 114,
    paddingRight: 114,
    paddingBottom: 32,
    width: '80%',
    height: '100%',
    background: '#DFE7E8',
    borderRadius: 8,
    display: 'flex',
    flexDirection: 'column',
  },
  skeletonHeader: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  skeletonSubHeader: {
    width: '18%',
    height: 23,
    background: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 8,
  },
  skeletonBody: {
    paddingTop: 16,
    paddingBottom: 16,
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
  },
  skeletonSubBody: {
    height: 46,
    background: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 8,
  },
  footer: {
    display: 'grid',
    gridTemplateColumns: '1fr 150px 150px 150px 150px 1fr',
    padding: theme.spacing(8, 8),
    justifyContent: 'center',
    '& > *': {
      textAlign: 'center',
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

  const selectedCircle = useRecoilValue(rSelectedCircle);
  const myAddress = useRecoilValue(rMyAddress);

  return (
    <div className={classes.root}>
      {myAddress ? (
        <div className={classes.header}>
          <p className={classes.title}>
            {!selectedCircle
              ? 'Welcome!'
              : `Welcome to ${selectedCircle.name}!`}
          </p>
          {!selectedCircle && (
            <div className={classes.welcomeSection}>
              <p className={classes.welcomeText}>
                This wallet isn&apos;t associated with a circle.
              </p>
              <p className={classes.welcomeText}>
                To join a circle, a circle admin can add you, or if your circle
                uses vouching, other circle members can vouch for you.
              </p>
              <p className={classes.welcomeText}>
                Or create a circle and join our{' '}
                <a href={EXTERNAL_URL_DISCORD} rel="noreferrer" target="_blank">
                  Discord
                </a>
                .
              </p>
              <Button
                variant="contained"
                color="primary"
                onClick={() => history.push(paths.getCreateCirclePath())}
                className={classes.startCircle}
              >
                Start a Circle
              </Button>
            </div>
          )}
        </div>
      ) : (
        <>
          <div className={classes.header}>
            <p className={classes.title}>Reward Your Fellow Contributors</p>
            <p className={classes.subTitle}>
              Connect your wallet to participate.
            </p>
          </div>
          <div className={classes.skeletonRoot}>
            <div className={classes.skeletonHeader}>
              <div className={classes.skeletonSubHeader} />
              <div className={classes.skeletonSubHeader} />
              <div className={classes.skeletonSubHeader} />
              <div className={classes.skeletonSubHeader} />
            </div>
            <div className={classes.skeletonBody}>
              <div className={classes.skeletonSubBody} />
              <div className={classes.skeletonSubBody} />
              <div className={classes.skeletonSubBody} />
              <div className={classes.skeletonSubBody} />
            </div>
          </div>
        </>
      )}
      <div className={classes.footer}>
        <div />
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
    </div>
  );
};

export default DefaultPage;
