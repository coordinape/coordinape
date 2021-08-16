import React from 'react';

import {
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
} from '@material-ui/core';

import { useFormField } from 'forms';

import { IFormField } from 'types';

export const ControlledRadioGroup = ({
  field,
  label,
}: {
  field: IFormField;
  label?: string;
}) => {
  const { value, updateValue, errorText } = useFormField<string>(field);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('ControlledRadioGroup.handleChange', e);
    updateValue(e.target.value);
  };

  return (
    <FormControl component="fieldset">
      {label ? <FormLabel component="legend">{label}</FormLabel> : undefined}
      <RadioGroup name={field.name} value={value} onChange={handleChange}>
        {field.options?.map((option) => (
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
