import { ComponentStory, ComponentMeta } from '@storybook/react';
import { withDesign } from 'storybook-addon-designs';

import BackButtonComponent from './BackButton';

export default {
  title: 'Design System/Components/BackButton',
  component: BackButtonComponent,
  decorators: [withDesign, Story => <Story />],
} as ComponentMeta<typeof BackButtonComponent>;

const Template: ComponentStory<typeof BackButtonComponent> = () => (
  <BackButtonComponent />
);

export const BackButton = Template.bind({});
