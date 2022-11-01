import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Box, Flex, HR, Text, TextArea } from 'ui';

import { SavingIndicator, StateOptions } from './SavingIndicator';

export default {
  component: SavingIndicator,
  argTypes: {
    saveState: {
      options: StateOptions,
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
        <HR />
        <Text variant="label">Component in Context</Text>
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
