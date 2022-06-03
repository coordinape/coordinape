import { ComponentStory, ComponentMeta } from '@storybook/react';

import { DownArrowIcon } from '../../icons';

import { IconButton } from './IconButton';

export default {
  title: 'Design System/Components/IconButton',
  component: IconButton,
} as ComponentMeta<typeof IconButton>;

const Template: ComponentStory<typeof IconButton> = args => (
  <IconButton>{args.children}</IconButton>
);

export const IconButtonArrow = Template.bind({});

IconButtonArrow.args = {
  size: 'xs',
  variant: 'ghost',
  children: <DownArrowIcon size="md" />,
};
