import { ComponentMeta, ComponentStory } from '@storybook/react';
import { withDesign } from 'storybook-addon-designs';

import { Box } from 'ui';

import {
  SingleColumnLayout as SingleColumnLayoutComponent,
  TwoColumnLayout as TwoColumnLayoutComponent,
} from './layouts';

export default {
  title: 'Design System/Components/Layouts',
  component: SingleColumnLayoutComponent,
  decorators: [withDesign, Story => <Story />],
  argTypes: {
    css: {
      table: {
        disable: true,
      },
    },
  },
} as ComponentMeta<typeof SingleColumnLayoutComponent>;

export const SingleColumnLayout: ComponentStory<
  typeof SingleColumnLayoutComponent
> = args => (
  <SingleColumnLayoutComponent {...args}>
    <Box css={{ backgroundColor: 'red', p: '$md' }} />
    <Box css={{ backgroundColor: 'green', p: '$md' }} />
    <Box css={{ backgroundColor: 'blue', p: '$md' }} />
  </SingleColumnLayoutComponent>
);

export const TwoColumnLayout: ComponentStory<typeof TwoColumnLayoutComponent> =
  args => (
    <TwoColumnLayoutComponent {...args}>
      <Box css={{ backgroundColor: 'red', p: '$md' }} />
      <Box css={{ backgroundColor: 'green', p: '$md' }} />
      <Box css={{ backgroundColor: 'blue', p: '$md' }} />
    </TwoColumnLayoutComponent>
  );
