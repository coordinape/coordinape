import { makeStyles } from '@material-ui/core';
import { useUserInfo } from 'contexts';
import moment from 'moment';
import React, { useEffect, useState } from 'react';

const useStyles = makeStyles((theme) => ({
  root: {
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingTop: 70,
    maxWidth: '70%',
    textAlign: 'center',
  },
  title: {
    fontSize: 54,
    fontWeight: 700,
    color: theme.colors.primary,
    margin: 0,
  },
  subTitle: {
    padding: '0 32px',
    fontSize: 30,
    fontWeight: 400,
    color: theme.colors.primary,
    margin: 0,
  },
  description: {
    padding: '0 100px',
    fontSize: 16,
    fontWeight: 400,
    color: theme.colors.primary,
    margin: 0,
  },
  warning: {
    marginBottom: 32,
    fontSize: 24,
    fontWeight: 500,
    color: theme.colors.secondary,
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
    const lastDay = moment(new Date(Date.UTC(2021, 2, 16, 0, 0, 0)));
    // const lastDay = moment.utc().add(1, 'M').startOf('month');
    const difference = lastDay.diff(date);

    let timeLeft = {};
    if (difference > 0) {
      timeLeft = {
        Days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        Hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        Minutes: Math.floor((difference / 1000 / 60) % 60),
        Seconds: Math.floor((difference / 1000) % 60),
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
    if (timeLeftIndex > 1) {
      return;
    }

    if (timeLeft[interval] !== 0 || interval === 'Seconds') {
      timeLeftString =
        timeLeftString +
        timeLeft[interval] +
        ' ' +
        interval +
        (timeLeftIndex === 0 ? ', ' : '.');
      timeLeftIndex++;
    }
  });

  return (
    <div className={classes.root}>
      <p className={classes.title}>Reward Yearn Contributors</p>
      {me ? (
        <div>
          <p className={classes.subTitle}>
            This epoch’s GET tokens will be distributed in {timeLeftString}
          </p>
          <p className={classes.description}>
            These tokens represent $20,000 of contributor budget. Make your
            allocations below to reward people for bringing value to Yearn.
          </p>
        </div>
      ) : (
        <p className={classes.subTitle}>
          You must be a current contributor and connect your wallet to
          participate
        </p>
      )}
    </div>
  );
};
