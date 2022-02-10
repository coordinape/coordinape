import { ComponentStory, ComponentMeta } from '@storybook/react';
import { withDesign } from 'storybook-addon-designs';

import { Box } from '../../ui';

import { ActionSection } from './ClaimCard';

export default {
  title: 'Design System/Molecules/ActionSection',
  component: ActionSection,
  decorators: [withDesign],
} as ComponentMeta<typeof ActionSection>;

const Template: ComponentStory<typeof ActionSection> = args => {
  return (
    <Box
      css={{
        display: 'grid',
        placeItems: 'center',
        padding: '$md',
        backgroundColor: '$gray',
      }}
    >
      <ActionSection {...args} />
    </Box>
  );
};

export const SingleActionSection = Template.bind({});

SingleActionSection.args = {
  actionText1: 'Claim 1680 USDC',
  actionText2: 'View History',
  onClaim: () => null,
  onViewHistory: () => null,
};

SingleActionSection.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/wXF7xGVv1j2SqwWfgbamS8/App-1.0?node-id=2777%3A6495',
  },
};
