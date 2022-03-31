import React from 'react';

import {
  Checkbox,
  FormControl,
  FormControlLabel,
  makeStyles,
} from '@material-ui/core';

import { ApeInfoTooltip } from 'components/ApeInfoTooltip/ApeInfoTooltip';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
  },
  label: {
    width: '100%',
    fontSize: 16,
    lineHeight: 1.3,
    fontWeight: 700,
    color: theme.colors.text,
  },
  body: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
  },
  controller: {
    flexGrow: 1,
  },
  redColor: {
    color: theme.colors.red,
  },
}));

export const ApeCheckbox = ({
  value = false,
  label,
  error,
  errorText,
  disabled,
  onChange,
  infoTooltip,
}: {
  value: boolean;
  label: string;
  error?: boolean;
  errorText?: string;
  disabled?: boolean;
  onChange: (isChecked: boolean) => void;
  infoTooltip?: React.ReactNode;
}) => {
  const classes = useStyles();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.checked);
  };

  return (
    <div className={classes.root}>
      <div className={classes.body}>
        <FormControl
          className={classes.controller}
          fullWidth
          component="fieldset"
          error={error}
        >
          <FormControlLabel
            value={label}
            key={label}
            disabled={disabled}
            classes={error ? { root: classes.redColor } : undefined}
            control={
              <Checkbox
                disabled={disabled}
                checked={value}
                onChange={isChecked => {
                  handleChange(isChecked);
                }}
                classes={error ? { root: classes.redColor } : undefined}
              />
            }
            label={<div className={classes.label}>{label}</div>}
          />
        </FormControl>
        {infoTooltip && <ApeInfoTooltip>{infoTooltip}</ApeInfoTooltip>}
      </div>
      {!!errorText && <div className={classes.redColor}>{errorText}</div>}
    </div>
  );
};
