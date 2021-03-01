import { makeStyles } from '@material-ui/core';
import moment from 'moment';
import React, { useEffect, useState } from 'react';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: 'auto',
    marginTop: 60,
    maxWidth: '60%',
    textAlign: 'center',
  },
  title: {
    fontSize: '54px',
    fontWeight: 'bold',
    color: '#5E6F74',
    margin: 0,
  },
  subTitle: {
    padding: '0px 32px',
    fontSize: '27px',
    color: '#5E6F74',
    margin: 0,
  },
}));

interface IProps {
  className?: string;
}

export const HeaderSection = (props: IProps) => {
  const classes = useStyles();

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

    if (timeLeft[interval] !== 0) {
      timeLeftString =
        timeLeftString + timeLeft[interval] + ' ' + interval + ' ';
      timeLeftIndex++;
    }
  });

  return (
    <div className={classes.root}>
      <p className={classes.title}>Reward Yearn Contributors</p>
      <p className={classes.subTitle}>
        GIVE tokens worth $38,000 will be distributed to contributors at the
        snapshot in {timeLeftString}
      </p>
    </div>
  );
};
