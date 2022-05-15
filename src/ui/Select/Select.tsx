import type * as Stitches from '@stitches/react';
import ReactSelect, { Props } from 'react-select';

import { modifyVariantsForStory } from '../type-utils';

export const Select = (props: Props) => {
  return <ReactSelect {...props} />;
};

/* Storybook utility for stitches variant props

NOTE: this can't live in the stories file because the storybook navigator will take a story and will crash
      I can't figure out why it can't be defined without being exported.
*/

type ComponentVariants = Stitches.VariantProps<typeof Select>;
type ComponentProps = ComponentVariants;

export const SelectStory = modifyVariantsForStory<
  ComponentVariants,
  ComponentProps,
  typeof Select
>(Select);
