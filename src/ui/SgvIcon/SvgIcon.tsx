import { styled, theme } from '../../stitches.config';

const colorVariants = Object.keys(theme.colors).reduce(
  (prev, curr) => ({ ...prev, [curr]: { $$color: '$colors$' + curr } }),
  {}
);

export const SvgIcon = styled('svg', {
  $$size: '1em',
  $$color: '$colors$black',
  lineHeight: '1em',
  verticalAlign: 'middle',
  width: '$$size',
  height: '$$size',
  $$viewBox: '0 0 10 10',

  viewBox: '$$viewBox',
  '& path': {
    stroke: '$$color',
    fill: '$color',
  },
  variants: {
    color: {
      inherit: {
        $$color: 'currentColor',
      },
      ...colorVariants,
    },
    size: {
      sm: {
        $$size: 10,
        $$viewBox: '0 0 10 10',
      },
      xl: {
        $$size: '$sizes$xl',
      },
    },
  },
  defaultVariants: {
    color: 'green',
    size: 'xs',
  },
});
