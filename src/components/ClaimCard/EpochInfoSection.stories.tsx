import { ComponentStory, ComponentMeta } from '@storybook/react';
import { withDesign } from 'storybook-addon-designs';

import { Box } from '../../ui';

import { EpochInfoSection } from './ClaimCard';

export default {
  title: 'Design System/Molecules/EpochInfoSection',
  component: EpochInfoSection,
  decorators: [withDesign],
} as ComponentMeta<typeof EpochInfoSection>;

const Template: ComponentStory<typeof EpochInfoSection> = args => {
  return (
    <Box
      css={{
        display: 'grid',
        placeItems: 'center',
        padding: '$md',
        backgroundColor: '$gray',
      }}
    >
      <EpochInfoSection {...args} />
    </Box>
  );
};

export const SingleEpochInfoSection = Template.bind({});

SingleEpochInfoSection.args = {
  title: 'Core Contributors',
  subTitle: 'Coordinape',
  giveInfo: 'You Received 125 GIVE',
};

SingleEpochInfoSection.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/wXF7xGVv1j2SqwWfgbamS8/App-1.0?node-id=2777%3A6479',
  },
};
