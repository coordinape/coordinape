import { makeStyles } from '@material-ui/core';
import { useConnectedWeb3Context, useUserInfo } from 'contexts';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { getApiService } from 'services/api';
import { ITokenGift, IUser, Maybe } from 'types';

const useStyles = makeStyles((theme) => ({
  root: {
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingTop: 56,
    maxWidth: '60%',
    textAlign: 'center',
  },
  title: {
    fontSize: 54,
    fontWeight: 700,
    color: theme.colors.primary,
    margin: 0,
  },
  subTitle: {
    padding: '0px 32px',
    fontSize: 30,
    fontWeight: 400,
    color: theme.colors.primary,
    margin: 0,
  },
}));

interface IProps {
  className?: string;
}

export const HeaderSection = (props: IProps) => {
  const classes = useStyles();
  const { me } = useUserInfo();

  const calculateTimeLeft = () => {
    const date = moment.utc();
    const lastDay = moment.utc().add(1, 'M').startOf('month');
    const difference = lastDay.diff(date);

    let timeLeft = {};
    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    // Clear timeout if the component is unmounted
    return () => clearTimeout(timer);
  }, []);

  let timeLeftString = '';
  let timeLeftIndex = 0;

  Object.typedKeys(timeLeft).forEach((interval) => {
    if (!timeLeft[interval] || timeLeftIndex > 1) {
      return;
    }

    if (timeLeft[interval] !== 0 || interval === 'seconds') {
      timeLeftString =
        timeLeftString + timeLeft[interval] + ' ' + interval + ' ';
      timeLeftIndex++;
    }
  });

  return (
    <div className={classes.root}>
      <p className={classes.title}>Reward Yearn Contributors</p>
      {me ? (
        <p className={classes.subTitle}>
          GIVE tokens will be distributed to contributors at the snapshot in{' '}
          {timeLeftString}
        </p>
      ) : (
        <p className={classes.subTitle}>
          You must be a current contributor and connect your wallet to
          participate
        </p>
      )}
    </div>
  );
};
