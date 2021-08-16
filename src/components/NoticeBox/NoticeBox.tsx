import React, { ReactNode } from 'react';

import clsx from 'clsx';
import { transparentize } from 'polished';

import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(0.5),
    fontSize: 14,
    fontWeight: 400,
    lineHeight: 1.45,
    borderRadius: theme.spacing(0.5),
  },
  success: {
    color: theme.palette.success.main,
    backgroundColor: transparentize(0.8)(theme.palette.success.main),
  },
  info: {
    color: theme.palette.info.main,
    backgroundColor: transparentize(0.8)(theme.palette.info.main),
  },
  warning: {
    color: theme.palette.warning.main,
    backgroundColor: transparentize(0.8)(theme.palette.warning.main),
  },
  error: {
    color: theme.palette.error.main,
    backgroundColor: transparentize(0.8)(theme.palette.error.main),
  },
}));

export const NoticeBox = ({
  className,
  variant,
  children,
}: {
  className?: string;
  variant?: 'success' | 'info' | 'warning' | 'error';
  children?: ReactNode;
}) => {
  const classes = useStyles();

  return (
    <span className={clsx(className, classes.root, classes[variant ?? 'info'])}>
      {children}
    </span>
  );
};
