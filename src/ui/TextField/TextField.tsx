import type * as Stitches from '@stitches/react';

import { disabledStyle, styled } from '../../stitches.config';
import { modifyVariantsForStory } from '../type-utils';

export const TextField = styled('input', {
  background: '$formInputBackground',
  padding: '$sm',
  border: '1px solid $formInputBorder',
  '&:focus': {
    borderColor: '$formInputBorderFocus',
  },
  '&:disabled': disabledStyle,
  '&::placeholder': {
    color: '$formInputPlaceholder',
  },
  display: 'flex',
  flexDirection: 'row',
  borderRadius: '$3',

  fontWeight: '$normal',
  fontSize: '$medium',
  lineHeight: '$base',

  color: '$text',
  variants: {
    inPanel: {
      true: {
        backgroundColor: '$surfaceNested',
      },
    },
    size: {
      sm: {
        width: '175px',
        height: '$xl',
        fontSize: '$small',
      },
      md: {
        lineHeight: '$short',
      },
    },
    fullWidth: {
      true: {
        width: '100%',
      },
    },
    error: {
      true: {
        backgroundColor: '$formInputErrorBackground !important',
        color: '$formInputErrorText !important',
        boxSizing: 'border-box',
        borderColor: '$formInputErrorBorder !important',
        '&:focus, &:focus-within': {
          borderColor: '$formInputErrorBorder !important',
        },
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
