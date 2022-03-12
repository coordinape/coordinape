import type * as Stitches from '@stitches/react';

import { styled } from '../../stitches.config';
import { modifyVariantsForStory } from '../type-utils';

export const IconButton = styled('button', {
  alignItems: 'center',
  appearance: 'none',
  borderWidth: '0',
  boxSizing: 'border-box',
  display: 'inline-flex',
  flexShrink: 0,
  fontFamily: 'inherit',
  fontSize: '$md',
  justifyContent: 'center',
  lineHeight: '1',
  outline: 'none',
  padding: '0',
  textDecoration: 'none',
  userSelect: 'none',
  WebkitTapHighlightColor: 'transparent',
  color: '$gray400',
  cursor: 'pointer',
  '&::before': {
    boxSizing: 'border-box',
  },
  '&::after': {
    boxSizing: 'border-box',
  },
  backgroundColor: '$loContrast',
  border: '1px solid $gray400',
  '@hover': {
    '&:hover': {
      borderColor: '$lightGray',
    },
  },
  '&:active': {
    backgroundColor: '$gray400',
  },
  '&:disabled': {
    pointerEvents: 'none',
    backgroundColor: 'transparent',
    color: '$surfaceGray',
  },

  variants: {
    size: {
      xs: {
        borderRadius: '$1',
        height: '$lg',
        width: '$lg',
      },
      sm: {
        borderRadius: '$2',
        height: '$xl',
        width: '$xl',
      },
      md: {
        borderRadius: '$2',
        height: '$1xl',
        width: '$1xl',
      },
      lg: {
        borderRadius: '$3',
        height: '$2xl',
        width: '$2xl',
      },
    },
    variant: {
      shadow: {
        backgroundColor: '$lightBackground',
        borderWidth: '0',
        '@hover': {
          '&:hover': {
            backgroundColor: '$lightGray',
          },
        },
        '&:active': {
          backgroundColor: '$lightGray',
        },
      },
      ghost: {
        backgroundColor: 'transparent',
        borderWidth: '0',
        '@hover': {
          '&:hover': {
            backgroundColor: '$transparent',
          },
        },
        '&:active': {
          backgroundColor: '$transparent',
        },
      },
    },
  },
  defaultVariants: {
    size: 'xs',
    variant: 'shadow',
  },
});

/* Storybook utility for stitches variant props

NOTE: this can't live in the stories file because the storybook navigator will take a story and will crash
      I can't figure out why it can't be defined without being exported.
*/

type ComponentVariants = Stitches.VariantProps<typeof IconButton>;
type ComponentProps = ComponentVariants;

export const IconButtonStory = modifyVariantsForStory<
  ComponentVariants,
  ComponentProps,
  typeof IconButton
>(IconButton);
