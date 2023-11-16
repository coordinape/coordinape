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
    h1: {
      true: {
        fontSize: '$h1',
        color: '$headingText',
        fontWeight: '$semibold',
        letterSpacing: '$header',
        '@sm': { fontSize: '$h2' },
      },
    },
    h2: {
      true: {
        fontSize: '$h2',
        color: '$headingText',
        fontWeight: '$semibold',
        letterSpacing: '$header',
        '@sm': { fontSize: '$h3' },
      },
    },
    large: {
      true: {
        fontSize: '$large',
        letterSpacing: '$header',
        '@sm': { fontSize: '$medium' },
      },
    },
    display: {
      true: {
        letterSpacing: '$header',
      },
    },
    linkStyle: {
      true: {
        color: '$link',
        textDecoration: 'none',
        cursor: 'pointer',
        '&:hover': {
          textDecoration: 'underline',
        },
      },
    },

    size: {
      xs: { fontSize: '$xs !important', lineHeight: '$shorter' },
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
        color: '$text !default',
        fontSize: '$medium',
        lineHeight: '$base',
        mb: '$xs',
        '&:last-of-type': {
          mb: 0,
        },
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
        a: {
          color: 'inherit',
          textDecoration: 'underline',
          fontWeight: 'normal',
        },
      },
    },
    color: {
      default: { color: '$text' },
      heading: { color: '$headingText' },
      neutral: { color: '$neutral' },
      alert: { color: '$alert' },
      warning: { color: '$warning' },
      primary: { color: '$primary' },
      cta: { color: '$cta' },
      coLinks: { color: '$coLinks' },
      coLinksCta: { color: '$coLinksCta' },
      secondary: { color: '$secondaryText' },
      active: { color: '$tagActiveText' },
      complete: { color: '$complete' },
      inherit: { color: 'inherit' },
      dim: { color: '$dimText' },
    },
    bold: { true: { fontWeight: '$bold !important' } },
    normal: { true: { fontWeight: '$normal !important' } },
    medium: { true: { fontWeight: '$medium !important' } },
    semibold: { true: { fontWeight: '$semibold !important' } },
    inline: { true: { display: 'inline !important' } },
  },
  compoundVariants: [
    {
      display: true,
      h1: true,
      css: {
        fontSize: '70px',
        '@md': {
          fontSize: '60px',
        },
        '@sm': {
          fontSize: '40px',
        },
      },
    },
    {
      display: true,
      h2: true,
      css: {
        fontSize: '40px',
        '@md': {
          fontSize: '32px',
        },
        '@sm': {
          fontSize: '22px',
        },
      },
    },
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

  defaultVariants: { color: 'inherit' },
});

export default Text;
