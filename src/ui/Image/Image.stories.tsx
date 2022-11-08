import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Image as ImageComponent } from './Image';

export default {
  component: ImageComponent,
} as ComponentMeta<typeof ImageComponent>;

const Template: ComponentStory<typeof ImageComponent> = args => (
  <ImageComponent {...args} />
);

export const Image = Template.bind({});
Image.args = {
  alt: 'Alt property',
  src: '../imgs/avatar/placeholder.jpg',
  width: 250,
};
