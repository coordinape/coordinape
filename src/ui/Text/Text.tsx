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
      inter: { fontFamily: 'Inter' },
    },
    color: {
      default: { color: '$text' },
      neutral: { color: '$neutral' },
      alert: { color: '$alert' },
      primary: { color: '$primary' },
    },
    bold: { true: { fontWeight: '$bold' } },
    normal: { true: { fontWeight: '$normal' } },
    semibold: { true: { fontWeight: '$semibold' } },
    inline: { true: { display: 'inline' } },

    h1: {
      true: { fontSize: '$h1', color: '$headingText', fontWeight: '$semibold' },
    },
    h2: {
      true: { fontSize: '$h2', color: '$headingText', fontWeight: '$semibold' },
    },
    h3: { true: { fontSize: '$h3', color: '$headingText' } },

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
        fontWeight: '$semibold',
        lineHeight: '$shorter',
      },
    },
  },

  defaultVariants: { font: 'inter', color: 'default' },
});

export default Text;
