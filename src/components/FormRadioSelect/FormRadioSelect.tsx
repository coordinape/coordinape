import React from 'react';

import {
  makeStyles,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  redColor: {
    color: theme.colors.red,
  },
}));

export const FormRadioSelect = ({
  value,
  onChange,
  label,
  options,
  errorText,
  error,
}: {
  value: string;
  onChange: (newValue: any) => void;
  label?: string;
  options: { value: string; label: string }[];
  errorText?: string;
  error?: boolean;
}) => {
  const classes = useStyles();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div>
      <FormControl component="fieldset" error={error}>
        {!!label && <FormLabel component="legend">{label}</FormLabel>}
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
