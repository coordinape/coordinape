import { Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import { ApeTextVariantType } from './ApeTextField.types';

export const useBaseStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  rootFullWidth: {
    width: '100%',
  },
  label: {
    fontSize: 16,
    lineHeight: 1.3,
    fontWeight: 700,
    marginBottom: theme.spacing(1),
    color: theme.colors.text,
  },
  inputRoot: {
    backgroundColor: theme.colors.third,
    borderRadius: 8,
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
    padding: theme.spacing(1.75, 1, 1.75),
    fontSize: 15,
    lineHeight: 1.33,
    fontWeight: 300,
    textAlign: 'center',
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

export const useSecondaryStyles = makeStyles((theme: Theme) => ({
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

type StylesType = typeof useBaseStyles & typeof useSecondaryStyles;

export const styles: Record<ApeTextVariantType, StylesType> = {
  primary: useBaseStyles,
  secondary: useSecondaryStyles,
};
