import React from 'react';

import {
  DeprecatedApeTextField,
  DeprecatedApeTextFieldWithRef,
} from 'components';
import { Text } from 'ui';

type Props = Omit<
  React.ComponentProps<typeof DeprecatedApeTextField>,
  'onChange'
> & {
  max: number;
  symbol: string;
  decimals: number;
  onChange: (newValue: number) => void;
  errorText?: string;
};

export const FormTokenField = React.forwardRef((props: Props, ref) => {
  const {
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
    ...otherProps
  } = props;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const num = Number(e.target.value);
    !Number.isNaN(num) && onChange(num);
  };

  return (
    <DeprecatedApeTextFieldWithRef
      ref={ref}
      {...otherProps}
      InputProps={{
        startAdornment: (
          <Text
            css={{ color: '$primary', cursor: 'pointer' }}
            onClick={() => onChange(Number(max))}
          >
            Max
          </Text>
        ),
        endAdornment: symbol.toUpperCase(),
      }}
      apeVariant="token"
      error={error}
      helperText={!errorText ? helperText : errorText}
      value={value}
      onChange={handleChange}
      type="number"
      placeholder="0"
      onFocus={event => (event.currentTarget as HTMLInputElement).select()}
    />
  );
});
FormTokenField.displayName = 'FormTokenField';
