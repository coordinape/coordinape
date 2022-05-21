import React, { useState } from 'react';

import clsx from 'clsx';
import uniqueId from 'lodash/uniqueId';

import {
  InputBase,
  InputBaseProps,
  Theme,
  TextFieldProps,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import { ApeInfoTooltip } from 'components';

const ApeTextVariants = {
  default: 'default',
  token: 'token',
  select: 'select',
} as const;

type ApeTextVariantType = typeof ApeTextVariants[keyof typeof ApeTextVariants];

interface ApeTextStyleProps {
  infoTooltip?: React.ReactNode;
  subtitle?: React.ReactNode;
  apeVariant?: ApeTextVariantType;
}

// ApeTextField
//
// Using the same interface as MaterialUI's TextField to make it compatible
// with the the calendar.
export type ApeTextFieldProps = TextFieldProps & ApeTextStyleProps;

export const ApeTextField = ({
  infoTooltip,
  subtitle,
  apeVariant = 'default',
  ...props
}: ApeTextFieldProps) => {
  // if there a custom variant search into variants styles and overwrite the base one
  const classes = useBaseStyles({ variant: apeVariant });

  const [fallbackId] = useState(uniqueId('text-field-'));

  // Using:
  // https://github.com/mui-org/material-ui/blob/master/packages/material-ui/src/InputBase/InputBase.js
  const {
    // For InputProps:
    'aria-describedby': ariaDescribedby,
    autoComplete,
    autoFocus,
    defaultValue,
    disabled,
    error,
    fullWidth,
    id,
    inputProps,
    inputRef,
    margin,
    multiline,
    name,
    onBlur,
    onChange,
    onClick,
    onFocus,
    onKeyDown,
    onKeyUp,
    placeholder,
    rows,
    rowsMax,
    type,
    value,
    // TextField props we want:
    // error,
    helperText,
    label,
    className,
    InputProps,
    // TODO: think about implementing:
    // color,
    // classes: textFieldClasses,
    // ...nonInputProps
  } = props;

  const inputClasses = {
    ...InputProps?.classes,
    root: clsx(
      classes.inputRoot,
      {
        [classes.inputRootError]: !!error,
      },
      InputProps?.classes?.root
    ),
    input: clsx(
      classes.input,
      { [classes.multiLineInput]: multiline },
      InputProps?.classes?.input
    ),
  };

  const mergedInputProps = {
    ...InputProps,
    ['aria-describedby']: ariaDescribedby,
    classes: inputClasses,
    autoComplete,
    autoFocus,
    defaultValue,
    disabled,
    error,
    fullWidth,
    id: id ?? fallbackId,
    inputProps,
    inputRef,
    margin:
      margin === 'dense' ? 'dense' : ('none' as 'dense' | 'none' | undefined),
    multiline,
    name,
    onBlur,
    onChange,
    onClick,
    onFocus,
    onKeyDown,
    onKeyUp,
    placeholder,
    rows,
    rowsMax,
    type,
    value,
  } as InputBaseProps;

  return (
    <div
      className={clsx(
        className,
        classes.root,
        fullWidth && classes.rootFullWidth
      )}
    >
      {(label || infoTooltip) && (
        <label htmlFor={id ?? fallbackId} className={classes.label}>
          {label}{' '}
          {infoTooltip && <ApeInfoTooltip>{infoTooltip}</ApeInfoTooltip>}
        </label>
      )}
      {subtitle && <label className={classes.subLabel}>{subtitle}</label>}
      <InputBase {...mergedInputProps} />
      <div className={classes.helperBox}>
        {helperText && (
          <span
            className={clsx({
              [classes.helper]: !error,
              [classes.error]: !!error,
            })}
          >
            {helperText}
          </span>
        )}
      </div>
    </div>
  );
};

//#region Styles
const apeVariants: any = (theme: Theme, variant: ApeTextVariantType) => {
  switch (variant) {
    case 'token':
      return {
        label: {
          margin: theme.spacing(0, 0, 1),
          fontSize: 16,
          fontWeight: 300,
          lineHeight: 1.2,
          color: theme.colors.text,
          textAlign: 'center',
        },
        inputRoot: {
          padding: theme.spacing(0, 1, 0),
          backgroundColor: theme.colors.surface,
          borderRadius: 16,
          color: theme.colors.text,
          border: `1px solid ${theme.colors.border}`,
          transition: 'border 200ms ease-out',
          '&:focus-within': {
            border: `1px solid ${theme.colors.secondary}80`,
          },
        },
        input: {
          padding: theme.spacing(0.75, 1, 0.75),
          fontSize: 32,
          lineHeight: 1.33,
          fontWeight: 400,
          textAlign: 'right',
          '&::placeholder': {
            color: theme.colors.secondaryText,
          },
        },
      };
    case 'select':
      return {
        inputRoot: {
          backgroundColor: theme.colors.white,
          borderColor: theme.colors.white,
        },
        input: {
          padding: theme.spacing(1.25, 0),
          fontSize: 16,
          lineHeight: 1.33,
          fontWeight: 400,
          textAlign: 'left',
          '&::placeholder': {
            color: theme.colors.placeholder,
            textAlign: 'left',
          },
        },
      };
    default:
      break;
  }
};

const useBaseStyles = makeStyles<Theme, { variant: ApeTextVariantType }>(
  (theme: Theme) => ({
    root: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    rootFullWidth: {
      width: '100%',
    },
    label: ({ variant }) => ({
      fontSize: 16,
      lineHeight: 1.3,
      fontWeight: 700,
      color: theme.colors.text,
      ...apeVariants(theme, variant)?.label,
    }),
    subLabel: {
      padding: theme.spacing(0, 0, 1),
      fontSize: 15,
      lineHeight: 1,
      color: theme.colors.text + '80',
    },
    inputRoot: ({ variant }) => ({
      margin: theme.spacing(1),
      backgroundColor: theme.colors.surface,
      borderRadius: 8,
      color: theme.colors.text,
      border: `1px solid ${theme.colors.border}`,
      transition: 'border 200ms ease-out',
      '&:focus-within': {
        border: `1px solid ${theme.colors.secondary}80`,
      },
      ...apeVariants(theme, variant)?.inputRoot,
    }),
    inputRootError: {
      border: `1px solid ${theme.colors.alert}dd`,
      color: theme.colors.alert,
      '&:focus-within': {
        border: `1px solid ${theme.colors.alert}`,
      },
    },
    input: ({ variant }) => ({
      fontSize: 15,
      lineHeight: 1.33,
      fontWeight: 300,
      textAlign: 'center',
      '&::placeholder': {
        color: theme.colors.secondaryText,
        textAlign: 'left',
      },
      ...apeVariants(theme, variant)?.input,
    }),
    helper: {
      fontSize: 13,
      lineHeight: 1.2,
      color: theme.colors.text + '80',
    },
    error: {
      fontSize: 13,
      lineHeight: 1.2,
      fontWeight: 600,
      color: theme.colors.alert,
    },
    multiLineInput: {
      textAlign: 'left',
      padding: theme.spacing(0, 1),
    },
    helperBox: {
      width: '100%',
      textAlign: 'center',
    },
  })
);
//#endregion
