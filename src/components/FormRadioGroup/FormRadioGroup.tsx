import React from 'react';

import {
  makeStyles,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
} from '@material-ui/core';

import { ApeInfoTooltip } from 'components';

const useStyles = makeStyles(theme => ({
  redColor: {
    color: theme.colors.red,
  },
  centered: {
    display: 'flex',
    justifyContent: 'center',
  },
}));

export const FormRadioGroup = ({
  value,
  onChange,
  label,
  options,
  errorText,
  error,
  infoTooltip,
}: {
  value: string | number;
  onChange: (newValue: any) => void;
  label?: string;
  options: { value: string | number; label: string }[];
  errorText?: string;
  error?: boolean;
  infoTooltip?: React.ReactNode;
}) => {
  const classes = useStyles();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className={classes.centered}>
      <FormControl component="fieldset" error={error}>
        {!!label && (
          <FormLabel component="legend">
            {label}{' '}
            {infoTooltip && <ApeInfoTooltip>{infoTooltip}</ApeInfoTooltip>}
          </FormLabel>
        )}
        <RadioGroup value={value} onChange={handleChange}>
          {options?.map(option => (
            <FormControlLabel
              value={option.value}
              key={option.value}
              classes={error ? { root: classes.redColor } : undefined}
              control={
                <Radio
                  classes={error ? { root: classes.redColor } : undefined}
                />
              }
              label={option.label}
            />
          ))}
        </RadioGroup>
      </FormControl>
      {!!errorText && <div className={classes.redColor}>{errorText}</div>}
    </div>
  );
};
