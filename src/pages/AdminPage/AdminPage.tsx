import React from 'react';

import { makeStyles } from '@material-ui/core';

import AdminContent from './AdminContent';
import AdminHeader from './AdminHeader';

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

  return (
    <div className={classes.root}>
      <AdminHeader />
      <AdminContent />
    </div>
  );
};

export default AdminPage;
