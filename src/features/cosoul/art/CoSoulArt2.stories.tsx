import LinkTo from '@storybook/addon-links/react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { CoSoulArt as CoSoulArtComponent } from './CoSoulArt';

export default {
  component: CoSoulArtComponent,
} as ComponentMeta<typeof CoSoulArtComponent>;

const Template: ComponentStory<typeof CoSoulArtComponent> = args => (
  <>
    <LinkTo kind="cosoul-cosoulart--co-soul-art">Link to another cosoul</LinkTo>
    <CoSoulArtComponent {...args} />
  </>
);

export const CoSoulArt2 = Template.bind({});
CoSoulArt2.args = {
  pGive: 9999,
  address: '0x6959A0e3C5486222cB8Ba3ab94e4f9444Df4F3bC',
  // showGui: true,
  // animate: true,
};
