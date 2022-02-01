import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Button, ButtonStory } from './Button';

export default {
  title: 'Design System/Components/Button',
  component: Button,
} as ComponentMeta<typeof ButtonStory>;

const Template: ComponentStory<typeof ButtonStory> = args => (
  <Button {...args}>{args.children}</Button>
);

export const SingleButton = Template.bind({});

SingleButton.args = {
  color: 'red',
  size: 'medium',
  children: 'Edit',
};
