import React, { Suspense } from 'react';

import { makeStyles } from '@material-ui/core';

import { LoadingScreen } from 'components';
import useCommonStyles from 'styles/common';

import MainHeader from './MainHeader';

const useStyles = makeStyles(() => ({
  root: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    background:
      'linear-gradient(180deg, #FFFFFF 0%, rgba(255, 255, 255, 0.4) 100%), #E5E5E5',
    '& > main': {
      flex: 1,
    },
  },
}));

export const MainLayout = (props: {
  className?: string;
  children: React.ReactNode | React.ReactNode[];
}) => {
  const classes = useStyles();
  const commonClasses = useCommonStyles();

  return (
    <div className={classes.root}>
      <MainHeader />
      <Suspense fallback={<LoadingScreen />}>
        <main className={commonClasses.scroll}>{props.children}</main>
      </Suspense>
    </div>
  );
};

export default MainLayout;
