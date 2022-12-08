import { ComponentStory, ComponentMeta } from '@storybook/react';
import { loginSupportedChainIds } from 'common-lib/constants';

import NetworkComponent from './Network';

const CHAIN_VARIANTS = Object.keys(loginSupportedChainIds);

export default {
  component: NetworkComponent,
  argTypes: {
    chainId: {
      options: CHAIN_VARIANTS,
      control: { type: 'radio' },
    },
  },
} as ComponentMeta<typeof NetworkComponent>;

const Template: ComponentStory<typeof NetworkComponent> = args => (
  <NetworkComponent {...args} />
);

export const Network = Template.bind({});
Network.args = {
  chainId: 1,
};
