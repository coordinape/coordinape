import { styled } from '../../stitches.config';

export const Text = styled('span', {
  lineHeight: '$none',
  margin: '0',
  fontWeight: 400,
  fontVariantNumeric: 'tabular-nums',
  display: 'flex', // FIXME: this assumes Text is used only for single-line text
  alignItems: 'center',
  color: '$text',

  variants: {
    font: {
      source: { fontFamily: 'Source Sans Pro' },
      space: { fontFamily: 'Space Grotesk' },
      inter: { fontFamily: 'Inter, sans-serif' },
    },
    color: {
      default: { color: '$text' },
      neutral: { color: '$neutral' },
      alert: { color: '$alert' },
      primary: { color: '$primary' },
    },
    bold: { true: { fontWeight: '$bold !important' } },
    normal: { true: { fontWeight: '$normal !important' } },
    medium: { true: { fontWeight: '$medium !important' } },
    semibold: { true: { fontWeight: '$semibold !important' } },
    inline: { true: { display: 'inline !important' } },

    h1: {
      true: { fontSize: '$h1', color: '$headingText', fontWeight: '$semibold' },
    },
    h2: {
      true: {
        fontSize: '$h2',
        fontWeight: '$semibold',
        lineHeight: '$shorter',
      },
    },
    h3: { true: { fontSize: '$h3' } },

    size: {
      small: { fontSize: '$small', lineHeight: '$shorter' },
      medium: { fontSize: '$medium', lineHeight: '$shorter' },
      large: { fontSize: '$large', lineHeight: '$shorter' },
    },
    variant: {
      label: {
        color: '$secondaryText',
        textTransform: 'uppercase',
        fontSize: '$small',
        fontWeight: '$bold',
        lineHeight: '$shorter',
      },
    },
    p: {
      true: {
        display: 'inline',
        color: '$text',
        fontSize: '$medium',
        lineHeight: '$base',
      },
    },
  },

  defaultVariants: { font: 'inter', color: 'default' },
});

export default Text;
