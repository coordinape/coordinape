import React from 'react';

import { DeprecatedApeTextField } from 'components/index';

export const DeprecatedFormTextField = ({
  value,
  onChange,
  helperText,
  error,
  errorText,
  ...props
}: Omit<React.ComponentProps<typeof DeprecatedApeTextField>, 'onChange'> & {
  onChange: (newValue: any) => void;
  errorText?: string;
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(
      typeof value === 'number' ? parseFloat(e.target.value) : e.target.value
    );
  };

  return (
    <DeprecatedApeTextField
      {...props}
      error={error}
      helperText={!errorText ? helperText : errorText}
      value={value}
      onChange={handleChange}
    />
  );
};
