import { styled } from '../../stitches.config';

export const Text = styled('span', {
  lineHeight: '$shorter',
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
      warning: { color: '$warning' },
      primary: { color: '$primary' },
      cta: { color: '$cta' },
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
        color: '$headingText',
        fontWeight: '$semibold',
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
        textTransform: '$textTransforms$label',
        fontSize: '$small',
        fontWeight: '$labelBold',
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
        color: '$tagSuccessText',
        backgroundColor: '$tagSuccessBackground',
      },
    },
    {
      tag: true,
      color: 'alert',
      css: {
        color: '$tagAlertText',
        backgroundColor: '$tagAlertBackground',
      },
    },
    {
      tag: true,
      color: 'warning',
      css: {
        color: '$tagWarningText',
        backgroundColor: '$tagWarningBackground',
      },
    },
    {
      tag: true,
      color: 'secondary',
      css: {
        color: '$tagSecondaryText',
        backgroundColor: '$tagSecondaryBackground',
      },
    },
    {
      tag: true,
      color: 'neutral',
      css: {
        color: '$tagNeutralText',
        backgroundColor: '$tagNeutralBackground',
      },
    },
  ],

  defaultVariants: { color: 'default' },
});

export default Text;
