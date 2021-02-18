import { makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import React from 'react';
import useCommonStyles from 'styles/common';

import { Header } from './components';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
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
      <main className={clsx(classes.content, commonClasses.scroll)}>
        {props.children}
      </main>
    </div>
  );
};
