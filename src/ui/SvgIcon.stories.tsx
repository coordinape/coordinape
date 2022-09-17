import { ComponentStory, ComponentMeta } from '@storybook/react';

import { ArrowLeft } from 'icons/__generated';

import { Box, Text } from './index';

export default {
  title: 'Design System/Components/SvgIcon',
  component: Box,
} as ComponentMeta<typeof Box>;

const Template: ComponentStory<typeof Box> = args => (
  <Box
    css={{
      display: 'flex',
      flexDirection: 'column',
      gap: '$sm',
    }}
  >
    {args.children}
  </Box>
);

export const SingleArrowLeft = Template.bind({});

SingleArrowLeft.args = {
  children: (
    <>
      <Box css={{ display: 'flex', gap: '$sm' }}>
        <Text>xs (10px)</Text>
        <ArrowLeft size="xs" />
      </Box>
      <Box css={{ display: 'flex', gap: '$sm' }}>
        <Text>sm (12px)</Text>
        <ArrowLeft size="sm" />
      </Box>
      <Box css={{ display: 'flex', gap: '$sm' }}>
        <Text>md (16px)</Text>
        <ArrowLeft size="md" />
      </Box>
      <Box css={{ display: 'flex', gap: '$sm' }}>
        <Text>lg (24px)</Text>
        <ArrowLeft size="lg" />
      </Box>
    </>
  ),
};
