import { useEffect, useRef } from 'react';

import type * as Stitches from '@stitches/react';
import autosize from 'autosize';

import { styled } from '../../stitches.config';
import { modifyVariantsForStory } from '../type-utils';

const StyledTextArea = styled('textarea', {
  background: '$surface',
  border: '1px solid transparent',
  '&:focus': {
    borderColor: '$primary',
    boxSizing: 'border-box',
  },
  '&::placeholder': {
    color: '$secondaryText',
  },
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '8px',

  p: '$sm',
  minHeight: 'calc($2xl * 2)',

  color: '$text',
  variants: {
    error: {
      true: {
        borderColor: 'transparent',
        backgroundColor: '$alertLight',
      },
    },
  },
});

export const TextArea = ({
  autoSize,
  ...rest
}: React.ComponentProps<typeof StyledTextArea> & {
  autoSize?: boolean;
}) => {
  const ref = useRef() as React.MutableRefObject<HTMLTextAreaElement>;

  useEffect(() => {
    if (ref.current && autoSize) {
      autosize(ref.current);
    }
  }, []);

  return <StyledTextArea {...rest} ref={ref} />;
};

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
