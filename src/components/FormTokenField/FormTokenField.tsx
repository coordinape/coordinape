import React from 'react';

import { ApeTextField } from 'components';

export const FormTokenField = ({
  value,
  symbol,
  // TODO: Handle decimals correctly.
  // value should be uint256 compatible
  // but then displayed in the text field as a float.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  decimals,
  max,
  onChange,
  helperText,
  error,
  errorText,
  ...props
}: Omit<React.ComponentProps<typeof ApeTextField>, 'onChange'> & {
  max: number;
  symbol: string;
  decimals: number;
  onChange: (newValue: number) => void;
  errorText?: string;
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const num = Number(e.target.value);
    !Number.isNaN(num) && onChange(num);
  };

  return (
    <ApeTextField
      {...props}
      InputProps={{
        startAdornment: <span onClick={() => onChange(max)}>MAX</span>,
        endAdornment: symbol.toUpperCase(),
      }}
      apeVariant="token"
      error={error}
      helperText={!errorText ? helperText : errorText}
      value={value}
      onChange={handleChange}
      type="number"
    />
  );
};
