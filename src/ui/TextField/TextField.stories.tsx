import { ComponentStory, ComponentMeta } from '@storybook/react';
import { withDesign } from 'storybook-addon-designs';

import { TextField } from './TextField';

export default {
  title: 'Design System/Components/TextField',
  component: TextField,
  decorators: [withDesign],
} as ComponentMeta<typeof TextField>;

const Template: ComponentStory<typeof TextField> = args => (
  <TextField {...args}>{args.children}</TextField>
);

export const SingleTextField = Template.bind({});

SingleTextField.args = {};

SingleTextField.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/wXF7xGVv1j2SqwWfgbamS8/Coordinape-Design-v8?node-id=233%3A425',
  },
};
