import { styled } from '../../stitches.config';

export const Text = styled('span', {
  lineHeight: '1',
  margin: '0',
  fontWeight: 400,
  fontVariantNumeric: 'tabular-nums',
  display: 'flex',
  alignItems: 'center',

  variants: {
    font: {
      source: {
        fontFamily: 'Source Sans Pro',
      },
      space: {
        fontFamily: 'Space Grotesk',
      },
      inter: {
        fontFamily: 'Inter',
      },
    },
    color: {
      default: {
        color: '$text',
      },
      red: {
        color: '$red',
      },
      gray: {
        color: '$gray400',
      },
    },
    bold: {
      true: {
        fontWeight: '$bold',
      },
    },
    inline: {
      true: {
        display: 'inline',
      },
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
        mb: '$xs',
      },
    },
  },

  defaultVariants: {
    font: 'space',
    color: 'default',
  },
});

export default Text;
