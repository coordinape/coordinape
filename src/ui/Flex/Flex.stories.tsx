import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Box } from 'ui';

import { Flex as FlexComponent } from './Flex';

export default {
  component: FlexComponent,
  argTypes: {
    alignItems: {
      options: ['start', 'center', 'end'],
      control: { type: 'inline-radio' },
    },
    column: { control: 'boolean' },
    row: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
} as ComponentMeta<typeof FlexComponent>;

const Template: ComponentStory<typeof FlexComponent> = args => (
  <FlexComponent
    {...args}
    css={{ gap: '$md', p: '$md', backgroundColor: 'Gold' }}
  >
    <Box css={{ p: '$md', backgroundColor: 'LightSalmon' }}>1</Box>
    <Box css={{ p: '$md', backgroundColor: 'YellowGreen' }}>2</Box>
    <Box css={{ p: '$md', backgroundColor: 'LightSkyBlue' }}>3</Box>
    <Box css={{ p: '$md', backgroundColor: 'Tomato' }}>4</Box>
    <Box css={{ p: '$md', backgroundColor: 'LavenderBlush' }}>5</Box>
  </FlexComponent>
);

export const Flex = Template.bind({});
Flex.args = {
  alignItems: 'start',
  column: true,
  row: false,
  disabled: false,
};
