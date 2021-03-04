import { makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import { linearGradient } from 'polished';
import React from 'react';
import useCommonStyles from 'styles/common';

import { Header } from './components';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
    background: theme.colors.third,
    backgroundImage:
      'linear-gradient(180deg, #FFFFFF 0%, rgba(255, 255, 255, 0.4) 100%);',
    paddingTop: theme.custom.appHeaderHeight,
  },
  content: {
    height: '100%',
  },
}));

interface IProps {
  className?: string;
  children: React.ReactNode | React.ReactNode[];
}

export const MainLayout = (props: IProps) => {
  const classes = useStyles();
  const commonClasses = useCommonStyles();
  return (
    <div className={classes.root}>
      <Header />
      <main className={clsx(classes.content, commonClasses.scroll)}>
        {props.children}
      </main>
    </div>
  );
};
