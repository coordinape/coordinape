import { ReactNode } from 'react';

import { makeStyles, Tooltip, Zoom } from '@material-ui/core';

import { InfoIcon } from 'icons';

const useStyles = makeStyles(theme => ({
  tooltip: {
    fontSize: 14,
    lineHeight: 1.4,
    fontWeight: 400,
    padding: theme.spacing(1),
    borderRadius: 8,
    boxShadow: '0px 4px 6px rgba(181, 193, 199, 0.16)',
    color: theme.colors.text,
    background:
      'linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(223, 237, 234, 0.4) 40.1%), linear-gradient(180deg, rgba(237, 253, 254, 0.4) 0%, rgba(207, 231, 233, 0) 100%), linear-gradient(0deg, #FFFFFF, #FFFFFF)',
  },
  icon: {
    fontSize: 'inherit',
    verticalAlign: 'baseline',
    margin: theme.spacing(0, 0.5),
  },
}));

export const ApeInfoTooltip = ({ children }: { children: ReactNode }) => {
  const classes = useStyles();

  return (
    <Tooltip
      title={<div>{children ?? 'blank'}</div>}
      placement="top-start"
      TransitionComponent={Zoom}
      classes={{ tooltip: classes.tooltip }}
    >
      <span>
        <InfoIcon inherit="inherit" className={classes.icon} />
      </span>
    </Tooltip>
  );
};
