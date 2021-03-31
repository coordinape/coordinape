import { makeStyles } from '@material-ui/core';
import React from 'react';
import { NavLink } from 'react-router-dom';

import { ContentSection, HeaderSection } from './components';

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
    margin: theme.spacing(1, 5),
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

const HomePage = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <HeaderSection />
      <ContentSection />
      <div className={classes.footer}>
        <a
          className={classes.link}
          href="https://twitter.com/coordinape"
          rel="noreferrer"
          target="_blank"
        >
          Twitter
        </a>
        <a
          className={classes.link}
          href="https://medium.com/iearn/decentralized-payroll-management-for-daos-b2252160c543"
          rel="noreferrer"
          target="_blank"
        >
          Medium
        </a>
        <a
          className={classes.link}
          href="https://facu.gitbook.io/coordinape/"
          rel="noreferrer"
          target="_blank"
        >
          About
        </a>
      </div>
    </div>
  );
};

export default HomePage;
