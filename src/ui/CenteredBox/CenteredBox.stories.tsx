import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Panel, Text } from '../../ui';

import CenteredBoxComponent from './CenteredBox';

export default {
  component: CenteredBoxComponent,
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
