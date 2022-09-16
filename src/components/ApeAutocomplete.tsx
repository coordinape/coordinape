import React from 'react';

import { makeStyles, InputProps } from '@material-ui/core';
import { Autocomplete, AutocompleteRenderInputParams } from '@material-ui/lab';

import { DeprecatedApeTextFieldWithRef } from 'components/index';
import type { DeprecatedApeTextField } from 'components/index';

const useStyles = makeStyles(theme => ({
  colorBlack: {
    color: theme.colors.black,
  },
  endAdornment: {
    right: theme.spacing(1),
  },
  listbox: {
    overflowX: 'hidden',
  },
  backgroundSecondary: {
    backgroundColor: theme.colors.white,
  },
  backgroundDefault: {
    backgroundColor: theme.colors.white,
  },
  autocompleteText: {
    backgroundColor: theme.colors.white,
    padding: theme.spacing(0, 1.5),
  },
}));

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
  const classes = useStyles();

  const {
    onChange,
    options,
    InputProps,
    TextFieldProps,
    color,
    size,
    error,
    placeholder,
    helperText,
    label,
    isSelect,
    ...otherProps
  } = props;

  let autocompleteClasses = {
    paper: classes.backgroundDefault,
    listbox: classes.listbox,
    clearIndicator: classes.colorBlack,
    endAdornment: classes.endAdornment,
  } as Record<string, string>;
  let textfieldClasses = {} as Record<string, string>;
  if (color === 'secondary') {
    autocompleteClasses = {
      ...autocompleteClasses,
      paper: classes.backgroundSecondary,
    };
    textfieldClasses = {
      ...textfieldClasses,
      root: classes.autocompleteText,
    };
  }

  return (
    <Autocomplete
      classes={autocompleteClasses}
      freeSolo
      fullWidth
      onInputChange={
        onChange ? (_event: any, v: string) => onChange(v) : undefined
      }
      options={options}
      renderInput={(params: AutocompleteRenderInputParams) => {
        return (
          <DeprecatedApeTextFieldWithRef
            ref={ref}
            {...params}
            InputProps={{
              ...params.InputProps,
              ...InputProps,
              classes: {
                ...(InputProps?.classes ?? {}),
                ...textfieldClasses,
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
  );
});
