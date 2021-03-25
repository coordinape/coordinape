import { makeStyles } from '@material-ui/core';
import React from 'react';

import { ContentSection, HeaderSection } from './components';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
}));

const TeamPage = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <HeaderSection />
      <ContentSection />
    </div>
  );
};

export default TeamPage;
