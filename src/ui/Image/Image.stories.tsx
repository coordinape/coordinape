import { ComponentStory, ComponentMeta } from '@storybook/react';
import { withDesign } from 'storybook-addon-designs';

import { Image as ImageComponent } from './Image';

export default {
  title: 'Design System/Components/Image',
  component: ImageComponent,
  decorators: [withDesign, Story => <Story />],
  argTypes: {
    ref: {
      table: {
        disable: true,
      },
    },
    as: {
      table: {
        disable: true,
      },
    },
    css: {
      table: {
        disable: true,
      },
    },
  },
} as ComponentMeta<typeof ImageComponent>;

const Template: ComponentStory<typeof ImageComponent> = args => (
  <ImageComponent {...args} />
);

export const Image = Template.bind({});
Image.args = {
  alt: 'Alt property',
  src: 'https://picsum.photos/200/300',
};
