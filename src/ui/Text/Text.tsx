import { styled } from '../../stitches.config';

export const Text = styled('span', {
  lineHeight: '$none',
  margin: '0',
  fontWeight: 400,
  fontVariantNumeric: 'tabular-nums',
  display: 'flex', // FIXME: this assumes Text is used only for single-line text
  alignItems: 'center',
  color: '$text',
  textAlign: 'left',

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
      secondary: { color: '$secondaryText' },
      active: { color: '$activeDark' },
      complete: { color: '$complete' },
      inherit: { color: 'inherit' },
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
      small: { fontSize: '$small !important', lineHeight: '$shorter' },
      medium: { fontSize: '$medium !important', lineHeight: '$shorter' },
      large: { fontSize: '$large !important', lineHeight: '$shorter' },
      xl: { fontSize: '$h2 !important', lineHeight: '$shorter' },
    },
    variant: {
      label: {
        color: '$secondaryText',
        textTransform: 'uppercase',
        fontSize: '$small',
        fontWeight: '$bold',
        lineHeight: '$shorter',
        display: 'flex',
        gap: '$xs',
      },
      formError: {
        color: '$alert',
        fontSize: '$small',
        fontWeight: '$semibold',
      },
    },
    p: {
      true: {
        display: 'block',
        color: '$text',
        fontSize: '$medium',
        lineHeight: '$base',
      },
    },
    ellipsis: {
      true: {
        display: 'block',
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        wordBreak: 'break-word',
        whiteSpace: 'nowrap',
        lineHeight: 'inherit',
      },
    },
    tag: {
      true: {
        fontSize: '$small',
        fontWeight: '$semibold',
        lineHeight: '$shorter',
        p: '$xs calc($xs + $xxs)',
        borderRadius: '$1',
      },
    },
  },
  compoundVariants: [
    {
      tag: true,
      color: 'active',
      css: {
        backgroundColor: '$active',
      },
    },
    {
      tag: true,
      color: 'complete',
      css: {
        backgroundColor: '$successLight',
      },
    },
  ],

  defaultVariants: { font: 'inter', color: 'default' },
});

export default Text;
