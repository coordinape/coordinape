/* eslint-disable react/display-name */
import React from 'react';

import { InputProps } from '@material-ui/core';
import { Autocomplete, AutocompleteRenderInputParams } from '@material-ui/lab';

import { DeprecatedApeTextFieldWithRef } from 'components/index';
import type { DeprecatedApeTextField } from 'components/index';
import { Box } from 'ui';

type Props = Omit<
  React.ComponentProps<typeof Autocomplete>,
  'renderInput' | 'onChange'
> & {
  options?: string[];
  onChange?: (newValue: any) => void;
  InputProps?: Partial<InputProps>;
  TextFieldProps?: Partial<React.ComponentProps<typeof DeprecatedApeTextField>>;
  color?: 'primary' | 'default' | 'secondary';
  size?: 'small' | 'medium';
  placeholder?: string;
  helperText?: string;
  error?: boolean;
  label?: string;
  isSelect?: boolean;
};

export const ApeAutocomplete = React.forwardRef((props: Props, ref) => {
  const {
    onChange,
    options,
    InputProps,
    TextFieldProps,
    size,
    error,
    placeholder,
    helperText,
    label,
    isSelect,
    ...otherProps
  } = props;

  return (
    <Box
      css={{
        '.root *': {
          background: '$formInputBackground',
          color: '$formInputText',
          '&::placeholder': {
            color: '$formInputPlaceholder',
          },
        },
        '.formInputWrapper': {
          border: '1px solid $formInputBorder',
          '&:focus-within': {
            borderColor: '$cta',
          },
        },
        '.colorBlack': {
          color: '$text',
        },
        '.endAdornment': {
          right: '$sm',
        },
        '.listbox': {
          overflowX: 'hidden',
        },
        '.backgroundSecondary': {
          backgroundColor: '$surfaceNested',
        },
        '.backgroundDefault': {
          backgroundColor: '$surfaceNested',
        },
        '.autocompleteText': {
          backgroundColor: '$surfaceNested',
          padding: '0 $md',
        },
      }}
    >
      <Autocomplete
        freeSolo
        fullWidth
        onInputChange={
          onChange ? (_event: any, v: string) => onChange(v) : undefined
        }
        options={options}
        renderInput={(params: AutocompleteRenderInputParams) => {
          return (
            <DeprecatedApeTextFieldWithRef
              className="root"
              ref={ref}
              {...params}
              InputProps={{
                ...params.InputProps,
                ...InputProps,
                classes: {
                  ...(InputProps?.classes ?? {}),
                },
              }}
              {...TextFieldProps}
              size={size ?? 'medium'}
              label={label}
              placeholder={placeholder}
              helperText={helperText}
              error={error}
              apeVariant={isSelect ? 'select' : undefined}
            />
          );
        }}
        {...otherProps}
      />
    </Box>
  );
});
