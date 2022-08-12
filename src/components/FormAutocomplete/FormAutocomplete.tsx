import React from 'react';

import { ApeAutocomplete } from 'components';

type Props = React.ComponentProps<typeof ApeAutocomplete> & {
  error?: boolean;
  errorText?: string;
  helperText?: string;
};

export const FormAutocomplete = React.forwardRef((props: Props, ref) => {
  const { value, onChange, helperText, error, errorText, ...otherProps } =
    props;
  return (
    <ApeAutocomplete
      ref={ref}
      {...otherProps}
      error={error}
      helperText={!errorText ? helperText : errorText}
      value={value}
      onChange={onChange}
    />
  );
});
FormAutocomplete.displayName = 'FormAutocomplete';
