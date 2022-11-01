import { ComponentStory, ComponentMeta } from '@storybook/react';
import { withDesign } from 'storybook-addon-designs';

import { Panel, Text } from '../../ui';

import CenteredBoxComponent from './CenteredBox';

export default {
  title: 'Design System/Components/Centered Box',
  component: CenteredBoxComponent,
  decorators: [withDesign, Story => <Story />],
} as ComponentMeta<typeof CenteredBoxComponent>;

const Template: ComponentStory<typeof CenteredBoxComponent> = args => (
  <CenteredBoxComponent {...args}>
    <Text h2 css={{ mb: '$lg', justifyContent: 'center' }}>
      Centered Text
    </Text>
    <Panel nested>Centered Panel</Panel>
  </CenteredBoxComponent>
);

export const CenteredBox = Template.bind({});
CenteredBox.parameters = {
  controls: { hideNoControlsWarning: true },
};
