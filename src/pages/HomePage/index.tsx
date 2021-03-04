import { makeStyles } from '@material-ui/core';
import { useUserInfo } from 'contexts';
import React from 'react';

import { ContentSection, EmptySection, HeaderSection } from './components';

import classes from '*.module.css';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  rootForEmpty: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
}));

interface IProps {
  className?: string;
}

const HomePage = (props: IProps) => {
  const classes = useStyles();
  const { me } = useUserInfo();

  return (
    <div className={me ? classes.root : classes.rootForEmpty}>
      <HeaderSection />
      {me ? <ContentSection /> : <EmptySection />}
    </div>
  );
};

export default HomePage;
