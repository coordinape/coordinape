import React from 'react';

import { TextFieldProps } from '@material-ui/core';

import { ApeTextField } from 'components';
import { useFormField } from 'forms';

import { IFormField } from 'types';

export const ControlledTextField = ({
  field,
  helperText,
  ...props
}: TextFieldProps & {
  field: IFormField;
}) => {
  const { value, updateValue, errorText } = useFormField<string>(field);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('ControlledTextField.handleChange', e);
    updateValue(e.target.value ?? '');
  };

  return (
    <ApeTextField
      {...props}
      error={!!errorText}
      helperText={!errorText ? helperText : errorText}
      value={value}
      onChange={handleChange}
    />
  );
};
