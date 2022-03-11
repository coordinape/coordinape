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
    },
  },

  defaultVariants: {
    font: 'space',
    color: 'default',
  },
});

export default Text;
