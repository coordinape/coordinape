import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Box, Text, ArrowDownLeftIcon, CheckIcon, TrashIcon } from '../index';

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
        <Text>xs (10px)</Text>
        <ArrowDownLeftIcon color="green" size="xs" />
      </Box>
      <Box css={{ display: 'flex', gap: '$sm' }}>
        <Text>sm (12px)</Text>
        <ArrowDownLeftIcon color="green" size="sm" />
      </Box>
      <Box css={{ display: 'flex', gap: '$sm' }}>
        <Text>md (16px)</Text>
        <ArrowDownLeftIcon color="green" size="md" />
      </Box>
      <Box css={{ display: 'flex', gap: '$sm' }}>
        <Text>lg (24px)</Text>
        <ArrowDownLeftIcon color="green" size="lg" />
      </Box>
    </>
  ),
};

export const SingleCheckIcon = Template.bind({});

SingleCheckIcon.args = {
  children: (
    <>
      <Box css={{ display: 'flex', gap: '$sm' }}>
        <Text>xs (10px)</Text>
        <CheckIcon color="green12" fill size="xs" />
      </Box>
      <Box css={{ display: 'flex', gap: '$sm' }}>
        <Text>sm (12px)</Text>
        <CheckIcon color="green12" fill size="sm" />
      </Box>
      <Box css={{ display: 'flex', gap: '$sm' }}>
        <Text>md (16px)</Text>
        <CheckIcon color="green12" fill size="md" />
      </Box>
      <Box css={{ display: 'flex', gap: '$sm' }}>
        <Text>lg (24px)</Text>
        <CheckIcon color="green12" fill size="lg" />
      </Box>
    </>
  ),
};

export const SingleTrashIcon = Template.bind({});

SingleTrashIcon.args = {
  children: (
    <>
      <Box css={{ display: 'flex', gap: '$sm' }}>
        <Text>xs (10px)</Text>
        <TrashIcon color="gray400" size="xs" />
      </Box>
      <Box css={{ display: 'flex', gap: '$sm' }}>
        <Text>sm (12px)</Text>
        <TrashIcon color="gray400" size="sm" />
      </Box>
      <Box css={{ display: 'flex', gap: '$sm' }}>
        <Text>md (16px)</Text>
        <TrashIcon color="gray400" size="md" />
      </Box>
      <Box css={{ display: 'flex', gap: '$sm' }}>
        <Text>lg (24px)</Text>
        <TrashIcon color="gray400" size="lg" />
      </Box>
    </>
  ),
};

// NOTE: size="xs" is default variant
