import { TextFieldProps } from '@material-ui/core';

export const ApeTextVariants = {
  default: 'default',
  token: 'token',
} as const;

export type ApeTextVariantType =
  typeof ApeTextVariants[keyof typeof ApeTextVariants];

interface StyleProps {
  infoTooltip?: React.ReactNode;
  apeVariant?: ApeTextVariantType;
}

export type ApeTextFieldProps = TextFieldProps & StyleProps;
