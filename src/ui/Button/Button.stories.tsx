import { ComponentStory, ComponentMeta } from '@storybook/react';
import { withDesign } from 'storybook-addon-designs';

import { Flex, Text, Box, TextArea, HR } from 'ui';

import { Button, ButtonStory } from './Button';

export default {
  component: Button,
  decorators: [
    withDesign,
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
  argTypes: {
    color: {
      control: { type: 'select' },
    },
  },
} as ComponentMeta<typeof ButtonStory>;

const Template: ComponentStory<typeof ButtonStory> = args => (
  <Flex css={{ alignItems: 'center', gap: '$sm' }}>
    <Button size={args.size} {...args}>
      {args.children}
    </Button>
  </Flex>
);

export const Default = Template.bind({});

Default.args = {
  color: 'primary',
  children: 'Button',
};

Default.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/wXF7xGVv1j2SqwWfgbamS8/Coordinape-Design-v8?node-id=338%3A94',
  },
};
