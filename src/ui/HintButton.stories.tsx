import { ComponentStory, ComponentMeta } from '@storybook/react';

import HintButtonComponent from './HintButton';

export default {
  component: HintButtonComponent,
} as ComponentMeta<typeof HintButtonComponent>;

const Template: ComponentStory<typeof HintButtonComponent> = () => (
  <HintButtonComponent href={'https://coordinape.com/'}>
    Hint Button Content
  </HintButtonComponent>
);

export const HintButton = Template.bind({});
