import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Box, Flex, TextArea } from 'ui';

import { SavingIndicator } from './SavingIndicator';

export default {
  title: 'Design System/Components/SavingIndicator',
  component: SavingIndicator,
  argTypes: {
    saveState: {
      options: ['stable', 'buffered', 'scheduled', 'saving', 'saved', 'error'],
      control: { type: 'radio' },
    },
    retry: {
      control: 'function',
    },
  },
  decorators: [
    (Story: any) => (
      <>
        <Story />
        <Box css={{ mt: '$md', p: '$md', background: '$surface' }}>
          <TextArea css={{ width: '100%', background: 'white' }} />
          <Flex css={{ justifyContent: 'flex-end', mt: '$md' }}>
            <Story />
          </Flex>
        </Box>
      </>
    ),
  ],
} as ComponentMeta<typeof SavingIndicator>;

const Template: ComponentStory<typeof SavingIndicator> = args => (
  <SavingIndicator {...args} />
);

export const Default = Template.bind({});
Default.args = {
  saveState: 'saved',
  retry: () => alert("Let's give it a retry!"),
};
export const ErrorWithRetry = Template.bind({});
ErrorWithRetry.args = {
  saveState: 'error',
  retry: () => alert('Retried!'),
};
