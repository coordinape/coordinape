import React, { useEffect, useImperativeHandle, useRef } from 'react';

import type * as Stitches from '@stitches/react';
import autosize from 'autosize';

import { styled } from '../../stitches.config';
import { modifyVariantsForStory } from '../type-utils';

const StyledTextArea = styled('textarea', {
  fontSize: '$medium',
  whiteSpace: 'pre-wrap',
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

type Props = React.ComponentProps<typeof StyledTextArea> & {
  autoSize?: boolean;
};

export const TextArea = React.forwardRef((props: Props, ref) => {
  const { autoSize, ...rest } = props;

  const textAreaRef = useRef() as React.MutableRefObject<HTMLTextAreaElement>;

  useImperativeHandle(ref, () => ({
    focus: () => {
      textAreaRef.current.focus();
    },
  }));

  useEffect(() => {
    if (textAreaRef.current && autoSize) {
      autosize(textAreaRef.current);
    }
  }, []);

  return <StyledTextArea {...rest} ref={textAreaRef} />;
});

TextArea.displayName = 'TextArea';
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
