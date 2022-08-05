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
import { Text, Flex } from 'ui';

const ApeTextVariants = {
  default: 'default',
  token: 'token',
  select: 'select',
} as const;

type ApeTextVariantType = typeof ApeTextVariants[keyof typeof ApeTextVariants];

type ApeSizeType = 'default' | 'small';

interface ApeTextStyleProps {
  infoTooltip?: React.ReactNode;
  subtitle?: React.ReactNode;
  prelabel?: React.ReactNode;
  apeVariant?: ApeTextVariantType;
  apeSize?: ApeSizeType;
}

// DeprecatedApeTextField
//
// Using the same interface as MaterialUI's TextField to make it compatible
// with the the calendar.
export type ApeTextFieldProps = TextFieldProps & ApeTextStyleProps;

export const DeprecatedApeTextField = ({
  infoTooltip,
  subtitle,
  prelabel,
  apeVariant = 'default',
  apeSize = 'default',
  ...props
}: ApeTextFieldProps) => {
  // if there a custom variant search into variants styles and overwrite the base one
  const classes = useBaseStyles({ variant: apeVariant, size: apeSize });

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
    onWheel,
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
    onWheel,
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
      <Flex css={{ justifyContent: 'space-between' }}>
        {prelabel && (
          <Text
            variant="label"
            as="label"
            htmlFor={id ?? fallbackId}
            className={classes.label}
            css={{ mb: '$xs' }}
          >
            {prelabel}{' '}
            {infoTooltip && <ApeInfoTooltip>{infoTooltip}</ApeInfoTooltip>}
          </Text>
        )}
        {(label || infoTooltip) && (
          <Text
            variant="label"
            as="label"
            htmlFor={id ?? fallbackId}
            className={classes.label}
            css={{ mb: '$xs' }}
          >
            {label}{' '}
            {!prelabel && infoTooltip && (
              <ApeInfoTooltip>{infoTooltip}</ApeInfoTooltip>
            )}
          </Text>
        )}
      </Flex>

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
const apeVariants: any = (
  theme: Theme,
  variant: ApeTextVariantType,
  size: ApeSizeType
) => {
  switch (variant) {
    case 'token':
      return {
        label: {
          margin: theme.spacing(0, 0, 1),
          fontSize: 16,
          fontWeight: 300,
          lineHeight: 1.2,
          color: theme.colors.text,
        },
        inputRoot: {
          padding:
            size === 'small'
              ? theme.spacing(0.5, 1, 0.5)
              : theme.spacing(0, 1, 0),
          backgroundColor:
            size === 'small' ? theme.colors.white : theme.colors.surface,
          borderRadius: size === 'small' ? 8 : 16,
          color: theme.colors.text,
          border: `1px solid ${theme.colors.border}`,
          transition: 'border 200ms ease-out',
          '&:focus-within': {
            border: `1px solid ${theme.colors.secondary}80`,
          },
          '&.Mui-disabled': {
            backgroundColor: theme.colors.surface,
          },
        },
        input: {
          padding: theme.spacing(0.75, 1, 0.75),
          fontSize: size === 'small' ? 16 : 32,
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
          padding: theme.spacing(0, 1, 0),
          border: `1px solid ${theme.colors.border}`,
          '&.Mui-disabled': {
            backgroundColor: theme.colors.surface,
          },
        },
        input: {
          padding: theme.spacing(1.25, 0),
          fontSize: 16,
          lineHeight: 1.33,
          fontWeight: 400,
          textAlign: 'left',
          '&::placeholder': {
            color: theme.colors.secondaryText,
            textAlign: 'left',
          },
        },
      };
    default:
      break;
  }
};

const useBaseStyles = makeStyles<
  Theme,
  { variant: ApeTextVariantType; size: ApeSizeType }
>((theme: Theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    margin: theme.spacing(0, 0, 1), // FIXME this should be removed
  },
  rootFullWidth: {
    width: '100%',
  },
  subLabel: {
    padding: theme.spacing(0, 0, 1),
    fontSize: 15,
    lineHeight: 1,
    color: theme.colors.text + '80',
  },
  inputRoot: ({ variant, size }) => ({
    backgroundColor: theme.colors.surface,
    borderRadius: 8,
    color: theme.colors.text,
    border: `1px solid transparent`,
    transition: 'border 200ms ease-out',
    '&:focus-within': {
      borderColor: theme.colors.borderMedium,
    },
    ...apeVariants(theme, variant, size)?.inputRoot,
  }),
  inputRootError: {
    border: `1px solid ${theme.colors.alert}dd`,
    color: theme.colors.alert,
    '&:focus-within': {
      border: `1px solid ${theme.colors.alert}`,
    },
  },
  input: ({ variant, size }) => ({
    padding: theme.spacing(1.75, 1, 1.75),
    fontSize: 15,
    lineHeight: 1.33,
    fontWeight: 300,

    '&::placeholder': {
      color: theme.colors.secondaryText,
    },
    ...apeVariants(theme, variant, size)?.input,
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
  },
}));
//#endregion
