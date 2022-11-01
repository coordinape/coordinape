import { ComponentStory, ComponentMeta } from '@storybook/react';
import { withDesign } from 'storybook-addon-designs';

import { Info } from 'icons/__generated';
import { Tooltip } from 'ui';

import { FormLabel as FormLabelComponent } from './FormLabel';
import type { FormLabelVariant } from './FormLabel';

const TYPES: FormLabelVariant[] = ['label', 'radioLabel', 'textField'];

export default {
  title: 'Design System/Components/Form Label',
  component: FormLabelComponent,
  decorators: [withDesign, Story => <Story />],
  argTypes: {
    type: {
      options: TYPES,
      control: { type: 'inline-radio' },
      defaultValue: 'label',
    },
    ref: {
      table: {
        disable: true,
      },
    },
    as: {
      table: {
        disable: true,
      },
    },
    css: {
      table: {
        disable: true,
      },
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
