import { Button, Hidden, makeStyles } from '@material-ui/core';
import React, { useEffect, useState } from 'react';

import { Content, Header } from './components';

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: '90%',
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingTop: theme.spacing(6),
    paddingBottom: theme.spacing(15),
    display: 'flex',
    flexDirection: 'column',
  },
}));

const AdminPage = () => {
  const classes = useStyles();

  // Return
  return (
    <div className={classes.root}>
      <Header />
      <Content />
    </div>
  );
};

export default AdminPage;
