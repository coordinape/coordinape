import { ComponentStory, ComponentMeta } from '@storybook/react';

import {
  Link as LinkComponent,
  LinkColorVariants,
  LinkTypeVariants,
} from './Link';

const COLOR_VARIANTS: LinkColorVariants[] = ['text', 'neutral', undefined];

const TYPE_VARIANTS: LinkTypeVariants[] = ['menu', undefined];

export default {
  component: LinkComponent,
  argTypes: {
    color: {
      options: COLOR_VARIANTS,
      control: { type: 'inline-radio' },
    },
    type: {
      options: TYPE_VARIANTS,
      control: { type: 'inline-radio' },
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
