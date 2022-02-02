import { makeStyles } from '@material-ui/core';

import { ApeInfoTooltip } from 'components';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  text: {
    fontSize: 12,
    fontWeight: 700,
    textAlign: 'center',
    color: 'rgba(81, 99, 105, 0.9)',
    width: 180,
    wordBreak: 'break-word',
  },
}));

export const CardInfoText = ({
  tooltip,
  children,
}: {
  tooltip: string;
  children: React.ReactNode;
}) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <ApeInfoTooltip>{tooltip}</ApeInfoTooltip>
      <span className={classes.text}>{children}</span>
    </div>
  );
};
