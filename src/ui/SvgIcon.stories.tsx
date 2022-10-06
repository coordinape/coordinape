import { ComponentStory, ComponentMeta } from '@storybook/react';

import { theme } from '../stitches.config';
import { X } from 'icons/__generated';

import { Flex, Text } from './index';

export default {
  title: 'Design System/Components/Icons',
  component: X,
  argTypes: {
    color: {
      options: Object.keys(theme.colors),
      control: { type: 'select' },
      defaultValue: 'black',
    },
    size: {
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      control: { type: 'inline-radio' },
      defaultValue: 'lg',
    },
    css: {
      table: {
        disable: true,
      },
    },
    nostroke: { control: 'boolean', defaultValue: false },
  },
} as ComponentMeta<typeof X>;

const context = require.context('../icons/__generated', true, /.tsx$/);
const components = context.keys().reduce((accum, path) => {
  const name = path.substring(2).replace('.tsx', '');
  return {
    ...accum,
    [name]: context(path),
  };
}, {});

const Template: ComponentStory<typeof X> = args => (
  <Flex css={{ flexWrap: 'wrap', gap: '$lg' }}>
    {Object.keys(components).map(name => {
      const Icon = (components as any)[name].default;
      return (
        <Flex
          key={name}
          css={{
            flexDirection: 'column',
            alignItems: 'center',
            gap: '$sm',
          }}
        >
          <Icon
            {...args}
            size={args.size ?? 'lg'}
            color={args.color ?? 'black'}
          />
          <Text size="small">{name}</Text>
        </Flex>
      );
    })}
  </Flex>
);

export const Icons = Template.bind({});
