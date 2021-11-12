export const ApeTextVariants = {
  default: 'default',
  token: 'token',
} as const;

export type ApeTextVariantType =
  typeof ApeTextVariants[keyof typeof ApeTextVariants];

export interface ApeTextStyleProps {
  infoTooltip?: React.ReactNode;
  apeVariant?: ApeTextVariantType;
}
