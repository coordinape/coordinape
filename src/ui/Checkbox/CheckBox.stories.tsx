import { ComponentStory, ComponentMeta } from '@storybook/react';

import CheckboxComponent from './CheckBox';

export default {
  component: CheckboxComponent,
  argTypes: {
    onChange: {
      table: {
        disable: true,
      },
    },
    value: {
      table: {
        disable: true,
      },
    },
    infoTooltip: {
      table: {
        disable: true,
      },
    },
  },
} as ComponentMeta<typeof CheckboxComponent>;

const Template: ComponentStory<typeof CheckboxComponent> = args => (
  <CheckboxComponent infoTooltip={<>Info tooltip on hover.</>} {...args} />
);

export const Checkbox = Template.bind({});
Checkbox.args = {
  label: 'Checkbox label',
  error: false,
  errorText: 'The error text',
  disabled: false,
};
