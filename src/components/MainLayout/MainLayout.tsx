import React, { Suspense } from 'react';

import { makeStyles } from '@material-ui/core';

import { LoadingScreen } from 'components';

import { MainHeader } from './MainHeader';

const useStyles = makeStyles(theme => ({
  root: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    '& > main': {
      flex: 1,
    },
  },
  scroll: {
    overflowY: 'auto',
    '&::-webkit-scrollbar': {
      width: theme.spacing(0.5),
    },
    '&::-webkit-scrollbar-track': {},
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: theme.colors.primary,
    },
    [theme.breakpoints.down('xs')]: {
      zIndex: 1, //for hamburger menu
    },
  },
}));

export const MainLayout = (props: {
  className?: string;
  children: React.ReactNode | React.ReactNode[];
}) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <MainHeader />
      <Suspense fallback={<LoadingScreen />}>
        <main className={classes.scroll}>{props.children}</main>
      </Suspense>
    </div>
  );
};

export default MainLayout;
