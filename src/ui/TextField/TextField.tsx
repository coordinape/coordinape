import type * as Stitches from '@stitches/react';

import { styled } from '../../stitches.config';
import { modifyVariantsForStory } from '../type-utils';

export const TextField = styled('input', {
  '&:focus': {
    border: '1px solid $lightBlue',
    boxSizing: 'border-box',
  },
  '&::placeholder': {
    color: '$placeholder',
  },
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  background: '$lightBackground',
  borderRadius: '8px',

  fontWeight: '$light',
  fontSize: '$4',
  lineHeight: '$base',

  textAlign: 'center',

  color: '$text',
  variants: {
    size: {
      sm: {
        width: '175px',
        height: '48px',
      },
      md: {
        width: '250px',
        height: '48px',
      },
    },
    variant: {
      fund: {
        width: '200px',
        fontSize: '$9',
        fontWeight: '$normal',
        textAlign: 'right',
        '&:focus': {
          border: 'none',
        },
        borderRadius: '0px',
      },
    },
    error: {
      true: {
        border: '1px solid $red',
        boxSizing: 'border-box',
      },
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

/* Storybook utility for stitches variant props

NOTE: this can't live in the stories file because the storybook navigator will take a story and will crash
      I can't figure out why it can't be defined without being exported.
*/

type ComponentVariants = Stitches.VariantProps<typeof TextField>;
type ComponentProps = ComponentVariants;

export const TextFieldStory = modifyVariantsForStory<
  ComponentVariants,
  ComponentProps,
  typeof TextField
>(TextField);
