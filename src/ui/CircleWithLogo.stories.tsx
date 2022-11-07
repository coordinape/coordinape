import { ComponentStory, ComponentMeta } from '@storybook/react';

import CircleWithLogoComponent from './CircleWithLogo';

export default {
  component: CircleWithLogoComponent,
} as ComponentMeta<typeof CircleWithLogoComponent>;

const Template: ComponentStory<typeof CircleWithLogoComponent> = args => (
  <CircleWithLogoComponent {...args} />
);

export const CircleWithLogo = Template.bind({});
CircleWithLogo.args = {
  logo: '../imgs/avatar/placeholder.jpg',
  name: 'Name Foo',
  orgLogo: '../imgs/tokens/yfi.png',
  orgName: 'Org Bar',
  admins: [
    { name: 'Admin 1', avatar: '../imgs/logo/favicon.png' },
    { name: 'Admin 2', avatar: '../imgs/logo/logo232.png' },
    { name: 'Admin 3', avatar: '../imgs/tokens/weth.png' },
  ],
};
