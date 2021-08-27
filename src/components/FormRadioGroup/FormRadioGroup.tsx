import React from 'react';

import {
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
} from '@material-ui/core';

export const FormRadioGroup = ({
  value,
  onChange,
  label,
  options,
}: {
  value: string;
  onChange: (newValue: any) => void;
  label?: string;
  options: { value: string; label: string }[];
  errorText?: string;
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('FormRadioGroup.handleChange', e);
    onChange(e.target.value);
  };

  return (
    <FormControl component="fieldset">
      {label ? <FormLabel component="legend">{label}</FormLabel> : undefined}
      <RadioGroup value={value} onChange={handleChange}>
        {options?.map((option) => (
          <FormControlLabel
            value={option.value}
            key={option.value}
            control={<Radio />}
            label={option.label}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
};
