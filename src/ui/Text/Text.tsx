import { styled } from '../../stitches.config';

export const Text = styled('span', {
  lineHeight: '1',
  margin: '0',
  fontWeight: 400,
  fontVariantNumeric: 'tabular-nums',
  display: 'flex', // FIXME: this assumes Text is used only for single-line text
  alignItems: 'center',

  variants: {
    font: {
      source: { fontFamily: 'Source Sans Pro' },
      space: { fontFamily: 'Space Grotesk' },
      inter: { fontFamily: 'Inter' },
    },
    color: {
      default: { color: '$text' },
      gray: { color: '$gray400' },
      red: { color: '$red' },
      blue: { color: '$blue' },
    },
    bold: {
      true: { fontWeight: '$bold' },
    },
    normal: {
      true: { fontWeight: '$normal' },
    },
    semibold: {
      true: { fontWeight: '$semibold' },
    },
    inline: {
      true: { display: 'inline' },
    },
    variant: {
      sectionHeader: {
        fontSize: '$8',
        fontWeight: '$bold',
      },
      formLabel: {
        color: '$gray400',
        textTransform: 'uppercase',
        fontSize: '$3',
        fontFamily: 'Inter',
        fontWeight: '$semibold',
      },
    },
  },

  defaultVariants: {
    font: 'space',
    color: 'default',
  },
});

export default Text;
