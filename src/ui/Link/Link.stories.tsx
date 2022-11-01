import { ComponentStory, ComponentMeta } from '@storybook/react';
import { withDesign } from 'storybook-addon-designs';

import {
  Link as LinkComponent,
  LinkColorVariants,
  LinkTypeVariants,
} from './Link';

const COLOR_VARIANTS: LinkColorVariants[] = ['text', 'neutral', undefined];

const TYPE_VARIANTS: LinkTypeVariants[] = ['menu', undefined];

export default {
  title: 'Design System/Components/Link',
  component: LinkComponent,
  decorators: [withDesign, Story => <Story />],
  argTypes: {
    color: {
      options: COLOR_VARIANTS,
      control: { type: 'inline-radio' },
    },
    type: {
      options: TYPE_VARIANTS,
      control: { type: 'inline-radio' },
    },
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
} as ComponentMeta<typeof LinkComponent>;

const Template: ComponentStory<typeof LinkComponent> = args => (
  <LinkComponent {...args} target="_blank" href={'#'}>
    Link label
  </LinkComponent>
);

export const Link = Template.bind({});
Link.args = {
  type: undefined,
  color: undefined,
};
