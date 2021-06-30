import React from 'react';

import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  root: {
    marginTop: 60,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: 105,
    paddingTop: 48,
    paddingLeft: 114,
    paddingRight: 114,
    paddingBottom: 32,
    width: '80%',
    height: '100%',
    background: '#DFE7E8',
    borderRadius: 8,
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  subHeader: {
    width: '18%',
    height: 23,
    background: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 8,
  },
  body: {
    paddingTop: 16,
    paddingBottom: 16,
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
  },
  subBody: {
    height: 46,
    background: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 8,
  },
  footer: {
    alignSelf: 'center',
  },
}));

export const PreconnectContent = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <div className={classes.subHeader} />
        <div className={classes.subHeader} />
        <div className={classes.subHeader} />
        <div className={classes.subHeader} />
      </div>
      <div className={classes.body}>
        <div className={classes.subBody} />
        <div className={classes.subBody} />
        <div className={classes.subBody} />
        <div className={classes.subBody} />
      </div>
    </div>
  );
};

export default PreconnectContent;
