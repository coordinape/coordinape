import type * as Stitches from '@stitches/react';

import { styled } from '../../stitches.config';
import { modifyVariantsForStory } from '../type-utils';

export const Button = styled('button', {
  '& img': {
    paddingRight: '$sm',
  },
  '& svg': {
    margin: '$sm',
  },
  px: '$md',
  display: 'flex',
  justifyContent: 'center',
  cursor: 'pointer',
  textAlign: 'center',
  alignItems: 'center',
  lineHeight: '$shorter',
  textDecoration: 'none',
  '&[disabled]': {
    opacity: 0.5,
  },

  '&:hover': {
    opacity: 0.8,
  },

  variants: {
    color: {
      primary: {
        backgroundColor: '$primary',
        color: '$textOnPrimary',
      },
      alert: {
        backgroundColor: '$alert',
        color: '$textOnAlert',
      },
      neutral: {
        backgroundColor: '$neutral',
        color: 'white',
      },
      surface: {
        backgroundColor: '$surface',
        color: '$text',
      },
      transparent: {
        padding: '$xs',
        backgroundColor: 'transparent',
        color: '$text',
        '&:hover': {
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
    },
    size: {
      large: {
        height: '$2xl',
        minHeight: '$2xl',
        alignItems: 'center',
        lineHeight: '$tall2',
        fontSize: '$large',
        fontWeight: '$bold',
        textTransform: 'none',
        borderRadius: '$4',
      },
      medium: {
        height: 'calc($xl + 4px)',
        minHeight: 'calc($xl + 4px)',
        fontSize: '$medium',
        fontWeight: '$bold',
        lineHeight: '$shorter',
        borderRadius: '$4',
      },
      small: {
        height: '$xl',
        minHeight: '$xl',
        fontSize: '$small',
        fontWeight: '$medium',
        lineHeight: '$shorter',
        borderRadius: '$3',
      },
      inline: {
        fontSize: '$2',
        fontWeight: '$medium',
        lineHeight: '$shorter',
        borderRadius: '$3',
        py: '0px',
        },
      iconOnly: {
        height: '$lg',
        minHeight: '$lg',
        width: '$lg',
        minWidth: '$lg',
        fontSize: '$1',
        fontWeight: '$medium',
        lineHeight: 'none',
        borderRadius: '$3',
      },
    },
    variant: {
      wallet: {
        fontSize: '15px',
        fontWeight: 600,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        color: '$text',
        border: 'solid',
        margin: '1.6px 0px',
        height: '$2xl',
        px: '$md',
        boxShadow: '0px 4px 6px rgb(181 193 199 / 30%)',
        borderWidth: '2px',
        borderRadius: '13px',
        backgroundColor: 'transparent',
        minWidth: '64px',
        '& svg': {
          height: '$lg',
          width: '$lg',
        },
        '&:hover': {
          color: '$secondary',
          background: '$surface',
          opacity: 1,
        },
        '&:disabled': {
          color: '$text',
          opacity: 0.5,
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
        backgroundColor: 'transparent !important',
        border: '1px solid',
      },
    },
  },
  compoundVariants: [
    {
      color: 'primary',
      outlined: true,
      css: {
        color: '$primary',
        borderColor: '$primary',
      },
    },
    {
      color: 'alert',
      outlined: true,
      css: {
        color: '$alert',
        borderColor: '$alert',
      },
    },
    {
      color: 'neutral',
      outlined: true,
      css: {
        color: '$neutral',
        borderColor: '$neutral',
      },
    },
  ],
  defaultVariants: {
    size: 'medium',
    color: 'neutral',
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
