import React from 'react';

import { ApeTextField } from 'components';

export const FormTextField = ({
  value,
  onChange,
  helperText,
  errorText,
  ...props
}: Omit<React.ComponentProps<typeof ApeTextField>, 'onChange'> & {
  onChange: (newValue: any) => void;
  errorText?: string;
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('FormTextField.handleChange', e.target.value);
    onChange(
      typeof value === 'number' ? Number(e.target.value) : e.target.value
    );
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
