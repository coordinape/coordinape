import type * as Stitches from '@stitches/react';

import { styled } from '../../stitches.config';
import { modifyVariantsForStory } from '../type-utils';

export const TextField = styled('input', {
  background: '$surface',
  padding: '$sm',
  border: '1px solid transparent',
  '&:focus': {
    borderColor: '$borderMedium',
  },
  '&::placeholder': {
    color: '$secondaryText',
  },
  display: 'flex',
  flexDirection: 'row',
  borderRadius: '8px',

  fontWeight: '$light',
  fontSize: '$medium',
  lineHeight: '$base',

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
        height: '48px',
      },
    },
    error: {
      true: {
        backgroundColor: '$alertLight',
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
