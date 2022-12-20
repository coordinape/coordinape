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
  '&:hover': {
    // using saturate until hover colors are defined
    filter: 'saturate(1.4)',
  },
  '&:focus': {
    filter: 'saturate(1.4)',
  },
  '&[disabled]': disabledStyle,

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
        color: '$headingText',
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
      white: {
        backgroundColor: '$white',
        color: '$primary',
      },
    },
    size: {
      large: {
        minHeight: '$2xl',
        alignItems: 'center',
        lineHeight: '$tall2',
        fontSize: '$large',
        fontWeight: '$bold',
        textTransform: 'none',
        borderRadius: '$4',
      },
      medium: {
        minHeight: '$xl',
        padding: '$xs calc($sm + $xs)',
        fontSize: '$medium',
        fontWeight: '$medium',
        lineHeight: '$shorter',
        borderRadius: '$3',
      },
      small: {
        minHeight: '$lg',
        fontSize: '$small',
        fontWeight: '$medium',
        lineHeight: '$shorter',
        borderRadius: '$1',
        padding: '$xs $sm',
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
        borderRadius: '$3',
        backgroundColor: 'transparent',
        minWidth: '64px',
        '& svg': {
          height: '$lg',
          width: '$lg',
        },
        '&:hover, &:focus': {
          filter: 'saturate(1)',
          color: '$primary',
          background: '$background',
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
        backgroundColor: 'transparent !important',
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
      color: 'primary',
      outlined: true,
      css: {
        color: '$primary',
        borderColor: '$primary',
        '&:hover, &:focus': {
          color: '$background',
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
        '&:hover, &:focus': {
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
        '&:hover, &:focus': {
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
        color: '$neutral',
        borderColor: '$neutral',
        '&:hover, &:focus': {
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
        '&:hover, &:focus': {
          color: '$white',
          filter: 'saturate(1)',
          backgroundColor: '$complete !important',
        },
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
