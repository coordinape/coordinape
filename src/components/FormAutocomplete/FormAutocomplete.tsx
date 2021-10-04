import React from 'react';

import { ApeAutocomplete } from 'components';

export const FormAutocomplete = ({
  value,
  onChange,
  helperText,
  error,
  errorText,
  ...props
}: React.ComponentProps<typeof ApeAutocomplete> & {
  error?: boolean;
  errorText?: string;
  helperText?: string;
}) => {
  return (
    <ApeAutocomplete
      {...props}
      error={error}
      helperText={!errorText ? helperText : errorText}
      value={value}
      onChange={onChange}
    />
  );
};
