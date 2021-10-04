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
      background: theme.colors.lightBlue + '80',
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
    minWidth: 102,
    borderRadius: 8,
    fontWeight: 300,
    '&:not(:last-child)': {
      borderRight: '1px solid white',
    },
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
  disabled: {
    opacity: 0.6,
  },
}));

export const ApeToggle = ({
  value,
  onChange,
  disabled,
  label,
  helperText,
  errorText,
  error,
  className,
}: {
  value: boolean;
  onChange: (newValue: boolean) => void;
  disabled?: boolean;
  label?: string;
  helperText?: string;
  errorText?: string;
  error?: boolean;
  className?: string;
}) => {
  const classes = useStyles();
  const [groupId] = useState(uniqueId('text-field-'));

  return (
    <div
      className={clsx(className, classes.root, {
        [classes.disabled]: disabled,
      })}
    >
      {!!label && (
        <label htmlFor={groupId} className={classes.label}>
          {label}
        </label>
      )}
      <ButtonGroup
        id={groupId}
        variant="contained"
        color="default"
        disableElevation
        disabled={disabled}
        classes={{
          grouped: classes.grouped,
          disabled: classes.disabled,
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
      {!!helperText && (
        <span
          className={clsx({
            [classes.helper]: !error,
            [classes.error]: !!error,
          })}
        >
          {errorText ?? helperText}
        </span>
      )}
    </div>
  );
};

export default ApeToggle;
