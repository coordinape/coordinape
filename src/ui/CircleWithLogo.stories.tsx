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
  logo: 'https://i.pravatar.cc/300?img=67',
  name: 'Name Foo',
  orgLogo: 'https://i.pravatar.cc/300?img=39',
  orgName: 'Org Bar',
  admins: [
    { name: 'Admin 1', avatar: 'https://i.pravatar.cc/300?img=1' },
    { name: 'Admin 2', avatar: 'https://i.pravatar.cc/300?img=2' },
    { name: 'Admin 3', avatar: 'https://i.pravatar.cc/300?img=3' },
  ],
};
