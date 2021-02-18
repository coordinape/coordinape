import { makeStyles } from '@material-ui/core';
import { Account } from 'components/Account';
import React from 'react';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '111px 166px',
    background: '#516369',
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  logo: {
    width: '221px',
    height: '58px',
  },
  description: {
    padding: '19px 2px',
  },
  title: {
    fontSize: '54px',
    fontWeight: 'bold',
    color: '#E7E7E7',
    margin: 0,
  },
  subTitle: {
    fontSize: '27px',
    color: '#E7E7E7',
    margin: 0,
  },
}));

interface IProps {
  className?: string;
}

export const HeaderSection = (props: IProps) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <div>
        <img
          alt="logo"
          className={classes.logo}
          src="svgs/logo/coordinape_logo.svg"
        />
        <div className={classes.description}>
          <p className={classes.title}>Reward Yearn Contributors</p>
          <p className={classes.subTitle}>
            GIVE tokens will be distributed in 4 DAYS & 6 HOURS
          </p>
        </div>
      </div>
      <Account />
    </div>
  );
};
