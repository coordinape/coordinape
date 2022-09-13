import type * as Stitches from '@stitches/react';

import { styled, theme, CSS } from '../../stitches.config';

const { colors } = theme;

type MappedColor = {
  [K in keyof typeof colors]: { $$color: `$color${string}` };
};

const colorVariants = Object.keys(colors).reduce(
  (prev, curr) => ({ ...prev, [curr]: { $$color: '$colors$' + curr } }),
  {} as MappedColor
);

export const SvgIcon = styled('svg', {
  $$size: '1em',
  $$color: '$colors$black',
  lineHeight: '1em',
  verticalAlign: 'middle',
  width: '$$size',
  height: '$$size',
  '& path': {
    stroke: '$$color',
    fill: '$$color',
  },
  variants: {
    color: {
      inherit: {
        $$color: 'currentColor',
      },
      ...colorVariants,
    },
    size: {
      xs: {
        $$size: '10px',
      },
      sm: {
        $$size: '12px',
      },
      md: {
        $$size: '16px',
      },
      lg: {
        $$size: '24px',
      },
      xl: {
        $$size: '48px',
      },
    },
  },
  defaultVariants: {
    color: 'inherit',
    size: 'md',
  },
});

SvgIcon.defaultProps = {
  viewBox: '0 0 10 10',
  preserveAspectRatio: 'none',
  fill: 'none',
  xmlns: 'http://www.w3.org/2000/svg',
};

export type SvgIconProps = {
  css?: CSS;
} & Stitches.VariantProps<typeof SvgIcon>;
