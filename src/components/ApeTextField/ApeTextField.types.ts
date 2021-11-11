import { TextFieldProps } from '@material-ui/core';

export const Variants = {
  primary: 'primary',
  secondary: 'secondary',
} as const;

export type ApeTextVariantType = typeof Variants[keyof typeof Variants];

interface StyleProps {
  infoTooltip?: React.ReactNode;
  customVariant?: ApeTextVariantType;
}

export type ApeTextFieldProps = TextFieldProps & StyleProps;
