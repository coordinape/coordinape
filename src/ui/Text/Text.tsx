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
    color: {
      default: { color: '$text' },
      neutral: { color: '$neutral' },
      alert: { color: '$alert' },
      primary: { color: '$primary' },
      secondary: { color: '$secondaryText' },
      active: { color: '$tagActiveText' },
      complete: { color: '$complete' },
      inherit: { color: 'inherit' },
    },
    bold: { true: { fontWeight: '$bold !important' } },
    normal: { true: { fontWeight: '$normal !important' } },
    medium: { true: { fontWeight: '$medium !important' } },
    semibold: { true: { fontWeight: '$semibold !important' } },
    inline: { true: { display: 'inline !important' } },

    h1: {
      true: {
        fontSize: '$h1',
        color: '$headingText',
        fontWeight: '$semibold',
        '@sm': { fontSize: '$h2' },
      },
    },
    h2: {
      true: {
        fontSize: '$h2',
        fontWeight: '$semibold',
        lineHeight: '$shorter',
        '@sm': { fontSize: '$h3' },
      },
    },
    h3: {
      true: { fontSize: '$h3', '@sm': { fontSize: '$large' } },
    },

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
        height: '$lg',
        p: '$xs calc($xs + $xxs)',
        borderRadius: '$1',
        gap: '$sm',
        justifyContent: 'center',
        whiteSpace: 'nowrap',
      },
    },
  },
  compoundVariants: [
    {
      tag: true,
      color: 'active',
      css: {
        color: '$tagActiveText',
        backgroundColor: '$tagActiveBackground',
      },
    },
    {
      tag: true,
      color: 'primary',
      css: {
        color: '$tagPrimaryText',
        backgroundColor: '$tagPrimaryBackground',
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

  defaultVariants: { color: 'default' },
});

export default Text;
