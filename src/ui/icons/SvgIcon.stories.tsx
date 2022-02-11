import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Box, ArrowDownLeftIcon, Text } from '../index';

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

export const SingleArrowDownLeftIcon = Template.bind({});

SingleArrowDownLeftIcon.args = {
  children: (
    <>
      <Box css={{ display: 'flex', gap: '$sm' }}>
        <Text>{`xs (10px)`}</Text>
        <ArrowDownLeftIcon size="xs" />
      </Box>
      <Box css={{ display: 'flex', gap: '$sm' }}>
        <Text>{`sm (12px)`}</Text>
        <ArrowDownLeftIcon size="sm" />
      </Box>
      <Box css={{ display: 'flex', gap: '$sm' }}>
        <Text>{`md (16px)`}</Text>
        <ArrowDownLeftIcon size="md" />
      </Box>
      <Box css={{ display: 'flex', gap: '$sm' }}>
        <Text>{`lg (24px)`}</Text>
        <ArrowDownLeftIcon size="lg" />
      </Box>
    </>
  ),
};

// NOTE: size="xs" is default variant
