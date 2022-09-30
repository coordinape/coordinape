import { ComponentStory, ComponentMeta } from '@storybook/react';
import { withDesign } from 'storybook-addon-designs';

import { Select } from './Select';

export default {
  title: 'Design System/Components/Select',
  component: Select,
  decorators: [
    withDesign,
    Story => (
      <div style={{ padding: 20, backgroundColor: '#edf1f4' }}>
        <Story />
      </div>
    ),
  ],
} as ComponentMeta<typeof Select>;

const Template: ComponentStory<typeof Select> = args => (
  <Select {...args}></Select>
);

export const SingleSelect = Template.bind({});

const options = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'orange', label: 'Orange' },
];

SingleSelect.args = {
  defaultValue: 'apple',
  options,
  background: 'bgWhite',
};

SingleSelect.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/wXF7xGVv1j2SqwWfgbamS8/Coordinape-Design-v8?node-id=233%3A425',
  },
};
