import React from 'react';

import { makeStyles } from '@material-ui/core';

import {
  EXTERNAL_URL_DOCS,
  EXTERNAL_URL_TWITTER,
  EXTERNAL_URL_LANDING_PAGE,
} from 'config/constants';

import PreconnectContent from './PreconnectContent';
import PreconnectHeader from './PreconnectHeader';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  footer: {
    position: 'fixed',
    left: 0,
    right: 0,
    bottom: theme.spacing(2),
    display: 'flex',
    justifyContent: 'center',
  },
  link: {
    position: 'relative',
    margin: theme.spacing(3, 8),
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

export const PreconnectPage = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <PreconnectHeader />
      <PreconnectContent />
      <div className={classes.footer}>
        <a
          className={classes.link}
          href={EXTERNAL_URL_TWITTER}
          rel="noreferrer"
          target="_blank"
        >
          Twitter
        </a>
        <a
          className={classes.link}
          href={EXTERNAL_URL_LANDING_PAGE}
          rel="noreferrer"
          target="_blank"
        >
          coordinape.com
        </a>
        <a
          className={classes.link}
          href={EXTERNAL_URL_DOCS}
          rel="noreferrer"
          target="_blank"
        >
          Docs
        </a>
      </div>
    </div>
  );
};

export default PreconnectPage;
