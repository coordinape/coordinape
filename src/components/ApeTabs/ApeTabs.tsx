import React from 'react';

import clsx from 'clsx';

import { makeStyles } from '@material-ui/core';

export interface IApeTab {
  label: string;
  panel: React.ReactNode;
}

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
  },
  tab: {
    cursor: 'pointer',
    width: 174,
    height: 47,
    borderRadius: '8px 8px 0 0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    size: 20,
    lineHeight: 1.25,
    fontWeight: 600,
    color: theme.colors.text,
    opacity: 0.5,
    '&:hover': {
      opacity: 1.0,
      background: 'rgba(255, 255, 255, 0.2)',
    },
  },
  activeTab: {
    background: 'rgba(255, 255, 255, 0.3)',
    opacity: 1.0,
  },
  panel: {
    background: 'rgba(255, 255, 255, 0.3)',
    borderRadius: '0 8px 8px 8px',
  },
}));

export const ApeTabs = ({
  className,
  tabs,
  tabIdx,
  setTabIdx,
}: {
  className?: string;
  tabs: IApeTab[];
  tabIdx: number;
  setTabIdx: (val: number) => void;
}) => {
  const classes = useStyles();

  return (
    <div className={clsx(className, classes.root)}>
      <div className={classes.header}>
        {tabs.map(({ label }, idx) => (
          <div
            key={idx}
            className={clsx(classes.tab, tabIdx === idx && classes.activeTab)}
            onClick={() => setTabIdx(idx)}
          >
            {label}
          </div>
        ))}
      </div>
      <div className={classes.panel}>{tabs[tabIdx]?.panel}</div>
    </div>
  );
};
