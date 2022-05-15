import { ComponentStory, ComponentMeta } from '@storybook/react';
import { withDesign } from 'storybook-addon-designs';

import { Select } from './Select';

export default {
  title: 'Design System/Components/Select',
  component: Select,
  decorators: [
    withDesign,
    Story => (
      <div style={{ width: 320 }}>
        <Story />
      </div>
    ),
  ],
} as ComponentMeta<typeof Select>;

const Template: ComponentStory<typeof Select> = args => (
  <Select {...args}></Select>
);

export const SingleSelect = Template.bind({});

SingleSelect.args = {
  options: [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' },
  ],
};

SingleSelect.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/wXF7xGVv1j2SqwWfgbamS8/Coordinape-Design-v8?node-id=233%3A425',
  },
};
