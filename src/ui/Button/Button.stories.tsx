import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Button } from './Button';

export default {
  title: 'Design System/Components/Button',
  component: Button,
} as ComponentMeta<typeof Button>;

const Template: ComponentStory<typeof Button> = args => (
  <Button color="red">{args.children}</Button>
);

export const ButtonWithNoIcon = Template.bind({});

ButtonWithNoIcon.args = {
  color: 'red',
  children: 'Edit',
};
