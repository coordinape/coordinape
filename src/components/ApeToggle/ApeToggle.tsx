import React, { useState } from 'react';

import clsx from 'clsx';
import uniqueId from 'lodash/uniqueId';

import { makeStyles, ButtonGroup, Button } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  inactive: {
    color: theme.colors.text,
    background: theme.colors.lightBackground,
    '&:hover': {
      background: theme.colors.lightBlue,
      color: theme.colors.white,
    },
  },
  active: {
    color: theme.colors.white,
    background: theme.colors.lightBlue,
    '&:hover': {
      background: theme.colors.lightBlue,
    },
  },
  grouped: {
    minWidth: 93,
    borderRadius: 8,
    fontWeight: 300,
  },
  label: {
    fontSize: 16,
    lineHeight: 1.3,
    fontWeight: 700,
    marginBottom: theme.spacing(1),
    color: theme.colors.text,
  },
  helper: {
    fontSize: 13,
    lineHeight: 1.2,
    marginTop: theme.spacing(1.5),
    color: theme.colors.text + '80',
  },
  error: {
    fontSize: 13,
    lineHeight: 1.2,
    fontWeight: 600,
    marginTop: theme.spacing(1.5),
    color: theme.colors.red,
  },
}));

export const ApeToggle = ({
  value,
  onChange,
  label,
  helperText,
  errorText,
  error,
  className,
}: {
  value: boolean;
  onChange: (newValue: boolean) => void;
  label?: string;
  helperText?: string;
  errorText?: string;
  error?: boolean;
  className?: string;
}) => {
  const classes = useStyles();
  const [groupId] = useState(uniqueId('text-field-'));

  return (
    <div className={clsx(className, classes.root)}>
      {label ? (
        <label htmlFor={groupId} className={classes.label}>
          {label}
        </label>
      ) : undefined}
      <ButtonGroup
        id={groupId}
        variant="contained"
        color="default"
        disableElevation
        classes={{
          grouped: classes.grouped,
        }}
      >
        <Button
          onClick={() => onChange(true)}
          className={value ? classes.active : classes.inactive}
        >
          Yes
        </Button>
        <Button
          onClick={() => onChange(false)}
          className={!value ? classes.active : classes.inactive}
        >
          No
        </Button>
      </ButtonGroup>
      {helperText ? (
        <span
          className={clsx({
            [classes.helper]: !error,
            [classes.error]: !!error,
          })}
        >
          {errorText ?? helperText}
        </span>
      ) : undefined}
    </div>
  );
};

export default ApeToggle;
