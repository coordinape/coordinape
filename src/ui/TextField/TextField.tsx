import type * as Stitches from '@stitches/react';

import { styled } from '../../stitches.config';
import { modifyVariantsForStory } from '../type-utils';

export const TextField = styled('input', {
  background: '$surface',
  border: '1px solid $border',
  '&:focus': {
    border: '1px solid $focusedBorder',
  },
  '&::placeholder': {
    color: '$secondaryText',
  },
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '8px',

  fontWeight: '$light',
  fontSize: '$medium',
  lineHeight: '$base',

  textAlign: 'center',

  color: '$text',
  variants: {
    inPanel: {
      true: {
        backgroundColor: '$white',
      },
    },
    size: {
      sm: {
        width: '175px',
        height: '$xl',
        fontSize: '$small',
      },
      md: {
        width: '250px',
        height: '$2xl',
      },
    },
    error: {
      true: {
        border: '1px solid $alert',
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
