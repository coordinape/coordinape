import { ComponentStory, ComponentMeta } from '@storybook/react';
import { withDesign } from 'storybook-addon-designs';

import { Box } from '../../ui';

import { AllocateFundsCard } from './AllocateFundsCard';

export default {
  title: 'Design System/Molecules/AllocateFundsCard',
  component: AllocateFundsCard,
  decorators: [withDesign],
} as ComponentMeta<typeof AllocateFundsCard>;

const Template: ComponentStory<typeof AllocateFundsCard> = args => {
  return (
    <Box
      css={{
        display: 'grid',
        placeItems: 'center',
        padding: '$md',
        backgroundColor: '$gray',
      }}
    >
      <AllocateFundsCard {...args}>{args.children}</AllocateFundsCard>
    </Box>
  );
};

export const SingleAllocateFundsCard = Template.bind({});

SingleAllocateFundsCard.args = {
  epochInfo: [
    {
      title: 'Core Contributors',
      subTitle: 'Coordinape',
      giveInfo: 'You Received 125 GIVE',
    },
  ],
  onClaim: () => null,
  onViewHistory: () => null,
};

export const TwoEpochAllocateFundsCard = Template.bind({});

TwoEpochAllocateFundsCard.args = {
  epochInfo: [
    {
      title: 'Core Contributors E:20',
      subTitle: 'Coordinape',
      giveInfo: 'You Received 125 GIVE',
    },
    {
      title: 'Core Contributors E:21',
      subTitle: 'Coordinape',
      giveInfo: 'You Received 125 GIVE',
    },
  ],
  onClaim: () => null,
  onViewHistory: () => null,
};

SingleAllocateFundsCard.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/wXF7xGVv1j2SqwWfgbamS8/App-1.0?node-id=2136%3A23884',
  },
};
