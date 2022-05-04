import { ComponentStory, ComponentMeta } from '@storybook/react';
import { withDesign } from 'storybook-addon-designs';

import { Box } from '../../ui';

import { ClaimCard } from './ClaimCard';

export default {
  title: 'Design System/Molecules/ClaimCard',
  component: ClaimCard,
  decorators: [withDesign],
} as ComponentMeta<typeof ClaimCard>;

const Template: ComponentStory<typeof ClaimCard> = args => {
  return (
    <Box
      css={{
        display: 'grid',
        placeItems: 'center',
        padding: '$md',
        backgroundColor: '$surface',
      }}
    >
      <ClaimCard {...args}>{args.children}</ClaimCard>
    </Box>
  );
};

export const SingleClaimCard = Template.bind({});

SingleClaimCard.args = {
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

export const TwoEpochClaimCard = Template.bind({});

TwoEpochClaimCard.args = {
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

SingleClaimCard.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/wXF7xGVv1j2SqwWfgbamS8/App-1.0?node-id=2777%3A6502',
  },
};
