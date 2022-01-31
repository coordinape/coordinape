import { ComponentStory, ComponentMeta } from '@storybook/react';

import { TextField } from './TextField';

export default {
  title: 'Design System/Components/TextField',
  component: TextField,
} as ComponentMeta<typeof TextField>;

const Template: ComponentStory<typeof TextField> = args => (
  <TextField {...args}>{args.children}</TextField>
);

export const SingleTextField = Template.bind({});

SingleTextField.args = {};
