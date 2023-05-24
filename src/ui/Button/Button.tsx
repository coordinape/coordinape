import type * as Stitches from '@stitches/react';

import { disabledStyle, styled } from '../../stitches.config';
import { modifyVariantsForStory } from '../type-utils';

export const Button = styled('button', {
  '> img, > svg': {
    mr: '$xs',
  },
  px: '$md',
  display: 'flex',
  justifyContent: 'center',
  cursor: 'pointer',
  textAlign: 'center',
  alignItems: 'center',
  lineHeight: '$shorter',
  textDecoration: 'none',
  whiteSpace: 'nowrap',
  '&[disabled]': disabledStyle,

  variants: {
    color: {
      cta: {
        backgroundColor: '$cta',
        color: '$textOnCta',
        '&:hover': {
          backgroundColor: '$ctaHover',
        },
      },
      primary: {
        backgroundColor: '$primaryButton',
        color: '$primaryButtonText',
        '&:hover': {
          backgroundColor: '$primaryButtonHover',
        },
        '&:focus-visible': {
          outline: '3px solid $primaryButtonBorderFocus',
          outlineOffset: '-3px',
        },
      },
      secondary: {
        backgroundColor: '$secondaryButton',
        color: '$secondaryButtonText',
        border: '1px solid $secondaryButtonText',
        '&:hover': {
          backgroundColor: '$secondaryButtonHover',
          color: '$secondaryButtonTextHover',
          borderColor: '$secondaryButtonBorderHover',
        },
        '&:focus-visible': {
          outline: '3px solid $borderFocus',
          outlineOffset: '-3px',
        },
      },
      selectedSecondary: {
        backgroundColor: '$secondaryButtonHover',
        color: '$secondaryButtonTextHover',
        border: '1px solid $secondaryButtonBorderHover',
        '&:hover': {
          filter: 'brightness(0.8)',
        },
        '&:focus-visible': {
          filter: 'brightness(0.8)',
        },
      },
      destructive: {
        backgroundColor: '$destructiveButton',
        color: '$destructiveButtonText',
        '&:hover': {
          backgroundColor: '$destructiveButtonHover',
        },
        '&:focus-visible': {
          outline: '3px solid $destructiveButtonBorderFocus',
          outlineOffset: '-3px',
        },
      },
      complete: {
        backgroundColor: '$successButton',
        color: '$successButtonText',
        '&:hover': {
          backgroundColor: '$successButtonHover',
        },
        '&:focus-visible': {
          outline: '3px solid $successButtonBorderFocus',
          outlineOffset: '-3px',
        },
      },
      neutral: {
        backgroundColor: '$neutralButton',
        border: '1px solid transparent',
        color: '$neutralButtonText',
        '&:hover, &[data-selected=true]': {
          backgroundColor: '$neutralButtonHover !important',
          borderColor: '$neutralButtonHover !important',
          color: '$neutralButtonTextHover !important',
        },
      },
      surface: {
        backgroundColor: '$surface',
        color: '$headingText',
        '&:hover': {
          filter: 'saturate(3)',
        },
        '&:focus': {
          filter: 'saturate(3)',
        },
      },
      tag: {
        backgroundColor: '$tagActiveBackground',
        color: '$tagActiveText',
      },
      transparent: {
        padding: '$xs',
        backgroundColor: 'transparent',
        color: '$text',
        '&:hover': {
          backgroundColor: 'transparent',
        },
        '&:focus': {
          backgroundColor: 'transparent',
        },
      },
      textOnly: {
        padding: '$xs',
        backgroundColor: 'transparent',
        color: '$text',
        '&:hover': {
          textDecoration: 'underline',
        },
      },
      dim: {
        backgroundColor: '$dim',
        color: '$textOnDim',
        '&:hover': {
          backgroundColor: '$dimButtonHover',
        },
      },
      navigation: {
        padding: '$xs',
        textAlign: 'left',
        backgroundColor: 'transparent',
        fontWeight: '$normal',
        color: '$navLinkText',
        '&:hover': {
          backgroundColor: '$navLinkHoverBackground',
        },
        '&:focus': {
          backgroundColor: '$navLinkHoverBackground',
        },
        '&.currentPage': {
          backgroundColor: '$navLinkHoverBackground',
        },
      },
      reaction: {
        backgroundColor: '$reactionButton',
        border: '1px solid transparent',
        color: '$reactionButtonText',
        borderColor: 'transparent',
        transition: '0.2s all',
        '&:hover': {
          borderColor: '$reactionButtonBorderHover !important',
          color: '$reactionButtonTextHover',
        },
        '&[data-myreaction=true]': {
          borderColor: '$reactionButtonBorderMine',
          backgroundColor: '$reactionButton',
        },
      },
    },
    size: {
      large: {
        minHeight: '$2xl',
        alignItems: 'center',
        lineHeight: '$tall2',
        fontSize: '$medium',
        fontWeight: '$medium',
        textTransform: 'none',
        borderRadius: '$4',
      },
      medium: {
        minHeight: '$xl',
        padding: '$sm calc($sm + $xs)',
        fontSize: '$medium',
        fontWeight: '$medium',
        lineHeight: '$shorter',
        borderRadius: '$4',
      },
      small: {
        minHeight: '$xl',
        padding: '$sm calc($sm + $xs)',
        fontSize: '$medium',
        fontWeight: '$medium',
        lineHeight: '$none',
        borderRadius: '$4',
      },
      xs: {
        minHeight: '$lg',
        padding: '$xs $sm',
        fontSize: '$small',
        fontWeight: '$medium',
        lineHeight: '$none',
        borderRadius: '$3',
      },
      tag: {
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
      inline: {
        fontSize: '$2',
        fontWeight: '$medium',
        lineHeight: '$shorter',
        borderRadius: '$1',
        py: '0px',
      },
      smallIcon: {
        height: '1em',
        width: '1em',
        fontSize: '$medium',
        lineHeight: 'none',
        borderRadius: '50%',
        padding: '2px',
        '& svg': {
          margin: 0,
        },
      },
    },
    variant: {
      wallet: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '$2xl',
        px: '$md',
        borderRadius: '$4',
        minWidth: '64px',

        backgroundColor: '$secondaryButton',
        color: '$secondaryButtonText',
        '& svg': {
          height: '$lg',
          width: '$lg',
        },
        '&:hover': {
          backgroundColor: '$surface',
          color: '$secondaryButtonText',
          borderColor: '$secondaryButtonBorderHover',
        },
        '&:focus-visible': {
          outline: '1px solid $borderFocus',
          outlineOffset: '-3px',
        },
        '&:disabled': {
          color: '$text',
        },
      },
    },
    noPadding: {
      true: {
        p: 0,
        '> img, > svg': {
          mr: 0,
        },
      },
    },
    fullWidth: {
      true: {
        width: '$full',
      },
    },
    outlined: {
      true: {
        backgroundColor: 'transparent',
        border: '1px solid',
      },
    },
    inline: {
      true: {
        display: 'inline',
      },
    },
    pill: {
      true: {
        borderRadius: '$pill',
      },
    },
  },
  compoundVariants: [
    {
      color: 'neutral',
      outlined: true,
      css: {
        background: '$neutralButtonOutlineBackground',
        color: '$neutralButtonOutlineText',
        borderColor: '$neutralButton',
      },
    },
    {
      color: 'tag',
      outlined: true,
      css: {
        color: '$tagActiveText',
        borderColor: '$tagActiveBackground',
        '&:hover': {
          color: '$tagActiveText',
          filter: 'saturate(1)',
          backgroundColor: '$tagActiveBackground !important',
        },
        '&:focus': {
          color: '$tagActiveText',
          filter: 'saturate(1)',
          backgroundColor: '$tagActiveBackground !important',
        },
      },
    },
  ],
  defaultVariants: {
    size: 'medium',
    color: 'primary',
  },
});

/* Storybook utility for stitches variant props

NOTE: this can't live in the stories file because the storybook navigator will take a story and will crash
      I can't figure out why it can't be defined without being exported.
*/

type ComponentVariants = Stitches.VariantProps<typeof Button>;
type ComponentProps = ComponentVariants;

export const ButtonStory = modifyVariantsForStory<
  ComponentVariants,
  ComponentProps,
  typeof Button
>(Button);
