import React from 'react';

import { ApeTextField } from 'components';

export const FormTextFieldNew = ({
  value,
  onChange,
  helperText,
  error,
  errorText,
  ...props
}: Omit<React.ComponentProps<typeof ApeTextField>, 'onChange'> & {
  onChange: (newValue: any) => void;
  errorText?: string;
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(
      typeof value === 'number' ? Number(e.target.value) : e.target.value
    );
  };

  return (
    <ApeTextField
      {...props}
      error={error}
      helperText={!errorText ? helperText : errorText}
      value={value}
      onChange={handleChange}
      customVariant="secondary"
    />
  );
};
