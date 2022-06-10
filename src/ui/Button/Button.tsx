import type * as Stitches from '@stitches/react';

import { styled } from '../../stitches.config';
import { modifyVariantsForStory } from '../type-utils';

export const Button = styled('button', {
  '& img': {
    paddingRight: '$sm',
  },
  '& svg': {
    margin: '0 $xs',
  },
  px: '$md',
  display: 'flex',
  justifyContent: 'center',
  cursor: 'pointer',
  textAlign: 'center',
  alignItems: 'center',
  lineHeight: '$shorter',
  textDecoration: 'none',
  '&:hover': {
    // using saturate until hover colors are defined
    filter: 'saturate(1.4)',
  },
  '&:focus': {
    filter: 'saturate(1.4)',
  },
  '&[disabled]': {
    opacity: 0.4,
    cursor: 'default',
  },

  variants: {
    color: {
      primary: {
        backgroundColor: '$primary',
        color: '$textOnPrimary',
      },
      secondary: {
        backgroundColor: '$secondary',
        color: '$textOnSecondary',
      },
      destructive: {
        backgroundColor: '$alert',
        color: '$textOnAlert',
      },
      neutral: {
        backgroundColor: '$neutral',
        color: 'white',
      },
      surface: {
        backgroundColor: '$surface',
        '&:hover': {
          filter: 'saturate(3)',
        },
        '&:focus': {
          filter: 'saturate(3)',
        },
      },
      complete: {
        backgroundColor: '$complete',
        color: 'white',
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
        height: '$xl',
        minHeight: '$xl',
        fontSize: '$medium',
        fontWeight: '$medium',
        lineHeight: '$shorter',
        borderRadius: '$3',
      },
      small: {
        height: '$lg',
        minHeight: '$lg',
        fontSize: '$small',
        fontWeight: '$medium',
        lineHeight: '$shorter',
        borderRadius: '$1',
        px: '$sm',
      },
      inline: {
        fontSize: '$2',
        fontWeight: '$medium',
        lineHeight: '$shorter',
        borderRadius: '$1',
        py: '0px',
      },
      smallIcon: {
        height: '$lg',
        minHeight: '$lg',
        width: '$lg',
        minWidth: '$lg',
        fontSize: '$1',
        fontWeight: '$medium',
        lineHeight: 'none',
        borderRadius: '$3',
        padding: 0,
        '& svg': {
          margin: 0,
        },
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
        },
        '&:focus': {
          color: '$secondary',
          background: '$surface',
        },
        '&:disabled': {
          color: '$text',
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
        '&:hover': {
          color: '$white',
          filter: 'saturate(1)',
          backgroundColor: '$primary !important',
        },
        '&:focus': {
          color: '$white',
          filter: 'saturate(1)',
          backgroundColor: '$primary !important',
        },
      },
    },
    {
      color: 'secondary',
      outlined: true,
      css: {
        color: '$secondary',
        borderColor: '$secondary',
        '&:hover': {
          color: '$white',
          filter: 'saturate(1)',
          backgroundColor: '$secondary !important',
        },
        '&:focus': {
          color: '$white',
          filter: 'saturate(1)',
          backgroundColor: '$secondary !important',
        },
      },
    },
    {
      color: 'destructive',
      outlined: true,
      css: {
        color: '$alert',
        borderColor: '$alert',
        '&:hover': {
          color: '$white',
          filter: 'saturate(1)',
          backgroundColor: '$alert !important',
        },
        '&:focus': {
          color: '$white',
          filter: 'saturate(1)',
          backgroundColor: '$alert !important',
        },
      },
    },
    {
      color: 'neutral',
      outlined: true,
      css: {
        color: '$text',
        borderColor: '$text',
        '&:hover': {
          color: '$white',
          filter: 'saturate(1)',
          backgroundColor: '$neutral !important',
        },
        '&:focus': {
          color: '$white',
          filter: 'saturate(1)',
          backgroundColor: '$neutral !important',
        },
      },
    },
    {
      color: 'complete',
      outlined: true,
      css: {
        color: '$complete',
        borderColor: '$complete',
        '&:hover': {
          color: '$white',
          filter: 'saturate(1)',
          backgroundColor: '$complete !important',
        },
        '&:focus': {
          color: '$white',
          filter: 'saturate(1)',
          backgroundColor: '$complete !important',
        },
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
