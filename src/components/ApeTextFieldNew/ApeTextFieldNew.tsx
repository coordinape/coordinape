import React, { useState } from 'react';

import clsx from 'clsx';
import uniqueId from 'lodash/uniqueId';

import {
  InputBase,
  TextFieldProps,
  makeStyles,
  InputBaseProps,
} from '@material-ui/core';

import { ApeInfoTooltip } from 'components';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  rootFullWidth: {
    width: '100%',
  },
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
    backgroundColor: theme.colors.third,
    borderRadius: 16,
    color: theme.colors.text,
    border: `1px solid ${theme.colors.third}`,
    transition: 'border 200ms ease-out',
    '&:focus-within': {
      border: `1px solid ${theme.colors.lightBlue}80`,
    },
  },
  inputRootError: {
    border: `1px solid ${theme.colors.red}dd`,
    color: '#ad0003',
    '&:focus-within': {
      border: `1px solid ${theme.colors.red}`,
    },
  },
  input: {
    padding: theme.spacing(0.75, 1, 0.75),
    fontSize: 32,
    lineHeight: 1.33,
    fontWeight: 400,
    textAlign: 'right',
    '&::placeholder': {
      color: theme.colors.text + '80',
    },
  },
  helper: {
    fontSize: 13,
    lineHeight: 1.2,
    color: theme.colors.text + '80',
  },
  error: {
    fontSize: 13,
    lineHeight: 1.2,
    fontWeight: 600,
    color: theme.colors.red,
  },
  multiLineInput: {
    textAlign: 'left',
    padding: theme.spacing(0, 1),
  },
  helperBox: {
    width: '100%',
    textAlign: 'center',
  },
}));

// ApeTextField
//
// Using the same interface as MaterialUI's TextField to make it compatible
// with the the calendar.
export const ApeTextFieldNew = ({
  infoTooltip,
  ...props
}: TextFieldProps & { infoTooltip?: React.ReactNode }) => {
  const classes = useStyles();
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
