import React from 'react';

import { parseUnits } from 'ethers/lib/utils';
import * as z from 'zod';

import {
  DeprecatedApeTextField,
  DeprecatedApeTextFieldWithRef,
} from 'components';
import { Text } from 'ui';

export const zTokenString = (min: string, max: string, decimals: number) =>
  z.string().refine(
    str => {
      const amount = parseUnits(str || '0', decimals);
      const result =
        amount.gt(parseUnits(min, decimals)) &&
        amount.lte(parseUnits(max, decimals));
      return result;
    },
    { message: `Amount must be greater than ${min} and no more than ${max}` }
  );

type Props = Omit<
  React.ComponentProps<typeof DeprecatedApeTextField>,
  'onChange'
> & {
  max: string;
  symbol: string;
  decimals: number;
  onChange: (newValue: string) => void;
  errorText?: string;
  value: string;
};

export const FormTokenField = React.forwardRef((props: Props, ref) => {
  const {
    value,
    symbol,
    decimals,
    max,
    onChange,
    helperText,
    error,
    errorText,
    ...otherProps
  } = props;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // only accept floating point inputs
    const matches = e.target.value.match(/\d*\.?\d*/);
    if (matches == null || e.target.value.length === 0) {
      onChange('');
      return;
    }
    const nextValue = matches[0];
    try {
      parseUnits(nextValue, decimals);
      onChange(nextValue);
    } catch (err: any) {
      // swallow the underflow error and just render the value with
      // a valid quantity of decimals

      // ethers errors are any-typed, unfortunately
      if (
        err.code &&
        err.fault &&
        err.code === 'NUMERIC_FAULT' &&
        err.fault === 'underflow'
      ) {
        const [whole = '0', frac = '0'] = nextValue.split('.');
        onChange(whole + '.' + frac.substring(0, decimals));
        return;
      } else {
        onChange(nextValue);
        throw err;
      }
    }
  };

  return (
    <DeprecatedApeTextFieldWithRef
      ref={ref}
      {...otherProps}
      InputProps={{
        startAdornment: (
          <Text
            css={{ color: '$primary', cursor: 'pointer' }}
            onClick={() => onChange(max)}
          >
            Max
          </Text>
        ),
        endAdornment: symbol.toUpperCase(),
      }}
      apeVariant="token"
      inputProps={{ 'data-testid': 'FormTokenField' }}
      error={error}
      helperText={!errorText ? helperText : errorText}
      value={value}
      onChange={handleChange}
      type="text"
      placeholder="0"
      onFocus={event => (event.currentTarget as HTMLInputElement).select()}
    />
  );
});
FormTokenField.displayName = 'FormTokenField';
