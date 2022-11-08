import { ComponentStory, ComponentMeta } from '@storybook/react';

import BackButtonComponent from './BackButton';

export default {
  component: BackButtonComponent,
} as ComponentMeta<typeof BackButtonComponent>;

const Template: ComponentStory<typeof BackButtonComponent> = () => (
  <BackButtonComponent />
);

export const BackButton = Template.bind({});
