import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Info } from 'icons/__generated';
import { Tooltip } from 'ui';

import { FormLabel as FormLabelComponent } from './FormLabel';
import type { FormLabelVariant } from './FormLabel';

const TYPES: FormLabelVariant[] = ['label', 'radioLabel', 'textField'];

export default {
  component: FormLabelComponent,
  argTypes: {
    type: {
      options: TYPES,
      control: { type: 'inline-radio' },
      defaultValue: 'label',
    },
  },
} as ComponentMeta<typeof FormLabelComponent>;

const Template: ComponentStory<typeof FormLabelComponent> = args => (
  <FormLabelComponent {...args}>
    Form Label Text
    <Tooltip css={{ ml: '$xs' }} content={<>Tooltip</>}>
      <Info size="sm" />
    </Tooltip>
  </FormLabelComponent>
);

export const FormLabel = Template.bind({});
FormLabel.args = {
  type: 'label',
};
