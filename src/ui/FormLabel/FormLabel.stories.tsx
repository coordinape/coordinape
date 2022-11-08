import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Info } from 'icons/__generated';
import { Form, TextField, Tooltip } from 'ui';

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
  <Form>
    <FormLabelComponent {...args} htmlFor="textfield">
      Form Label Text
      <Tooltip css={{ ml: '$xs' }} content={<>Tooltip</>}>
        <Info size="sm" />
      </Tooltip>
    </FormLabelComponent>
    <TextField id="textfield" placeholder={'Text Field Placeholder'} />
  </Form>
);

export const FormLabel = Template.bind({});
FormLabel.args = {
  type: 'label',
};
