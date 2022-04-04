import type * as Stitches from '@stitches/react';

import { styled } from '../../stitches.config';
import { modifyVariantsForStory } from '../type-utils';

export const TextArea = styled('textarea', {
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

  fontWeight: '$normal',
  fontSize: '$6',
  lineHeight: '29px',

  py: '$md',
  px: '$sm',

  textAlign: 'center',
  color: '$text',
  variants: {
    error: {
      true: {
        border: '1px solid $red',
        boxSizing: 'border-box',
      },
    },
    nominate: {
      true: {
        fontWeight: '$light',
        fontSize: '$4',
        lineHeight: '$base',
        color: '$text',
      },
    },
  },
});

/* Storybook utility for stitches variant props

NOTE: this can't live in the stories file because the storybook navigator will take a story and will crash
      I can't figure out why it can't be defined without being exported.
*/

type ComponentVariants = Stitches.VariantProps<typeof TextArea>;
type ComponentProps = ComponentVariants;

export const TextAreaStory = modifyVariantsForStory<
  ComponentVariants,
  ComponentProps,
  typeof TextArea
>(TextArea);
