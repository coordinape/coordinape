import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Text } from './Text';

export default {
  title: 'Design System/Components/Text',
  component: Text,
} as ComponentMeta<typeof Text>;

const Template: ComponentStory<typeof Text> = args => (
  <Text {...args}>{args.children}</Text>
);

export const SingleText = Template.bind({});

SingleText.args = {
  children: 'Simple Label',
};
