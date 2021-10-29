import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  circleWrapper: {
    width: '7.5em',
    height: '7.5em',
    borderRadius: '50%',
    backgroundColor: theme.colors.lightGray,
  },
  innerText: {
    textAlign: 'center',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignContent: 'center',
  },
  titleText: {
    color: theme.colors.text,
    fontSize: 14,
    paddingBottom: 0,
    marginBottom: 0,
  },
  subTitle: {
    fontSize: 12,
    color: theme.colors.lightText,
    marginTop: 0,
    paddingTop: 0,
  },
}));

interface CircleCardProps {
  name: string;
  epochTitle: string;
  startDays: string;
  startTime: string;
}

export default function CircleCard({
  name,
  epochTitle,
  startDays,
  startTime,
}: CircleCardProps) {
  const classes = useStyles();

  return (
    <div className={classes.circleWrapper}>
      <div className={classes.innerText}>
        <h6 className={classes.titleText}>{name}</h6>
        <h3 className={classes.subTitle}>
          Epoch {epochTitle} starts in {startDays} days {startTime} hours
        </h3>
      </div>
    </div>
  );
}
