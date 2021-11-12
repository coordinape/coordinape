import React from 'react';

import { ApeTextFieldNew } from 'components';

export const FormTextFieldNew = ({
  value,
  onChange,
  helperText,
  error,
  errorText,
  ...props
}: Omit<React.ComponentProps<typeof ApeTextFieldNew>, 'onChange'> & {
  onChange: (newValue: any) => void;
  errorText?: string;
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(
      typeof value === 'number' ? Number(e.target.value) : e.target.value
    );
  };

  return (
    <ApeTextFieldNew
      {...props}
      error={error}
      helperText={!errorText ? helperText : errorText}
      value={value}
      onChange={handleChange}
    />
  );
};
