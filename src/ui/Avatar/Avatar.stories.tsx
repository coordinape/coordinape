import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Avatar as AvatarComponent } from './Avatar';

export default {
  component: AvatarComponent,
  argTypes: {
    size: {
      options: ['xl', 'large', 'medium', 'small', 'xs'],
      control: { type: 'inline-radio' },
      defaultValue: 'xl',
    },
    margin: {
      options: ['none', 'small'],
      control: { type: 'inline-radio' },
      defaultValue: 'none',
    },
    css: {
      table: {
        disable: true,
      },
    },
    onClick: {
      table: {
        disable: true,
      },
    },
  },
} as ComponentMeta<typeof AvatarComponent>;

const Template: ComponentStory<typeof AvatarComponent> = args => (
  <AvatarComponent
    name={args.name}
    size={args.size}
    margin={args.margin}
    path={args.path}
    {...args}
  />
);

export const Avatar = Template.bind({});
Avatar.args = {
  name: 'foo',
  path: '../imgs/avatar/placeholder.jpg',
};
