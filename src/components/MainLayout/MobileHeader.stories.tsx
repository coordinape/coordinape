import { ReactElement, Suspense, useLayoutEffect } from 'react';

import { ComponentStory, ComponentMeta } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import { RecoilRoot, useRecoilState } from 'recoil';

import { ReactComponent as MetaMaskSVG } from 'assets/svgs/wallet/metamask-color.svg';
import { rApiManifest } from 'recoilState';

import { MobileHeader as Component } from './MobileHeader';

const mockAddress = '0xface0000face0001face0002face0003face0004';
const mockManifest = {
  active_epochs: [],
  circles: [],
  myUsers: [],
  profile: {
    id: 1,
    address: mockAddress,
    avatar: '../imgs/avatar/placeholder.jpg',
  },
};

const RecoilFixtures = ({ children }: { children: ReactElement }) => {
  const [manifest, setManifest] = useRecoilState(rApiManifest);
  useLayoutEffect(() => {
    setManifest(mockManifest);
  }, []);
  return manifest ? children : null;
};

export default {
  component: Component,
  decorators: [
    (Story: any) => (
      <RecoilRoot>
        <RecoilFixtures>
          <MemoryRouter>
            <Story />
          </MemoryRouter>
        </RecoilFixtures>
      </RecoilRoot>
    ),
  ],
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = args => (
  <Suspense fallback={null}>
    <Component {...args} />
  </Suspense>
);

export const MobileHeader = Template.bind({});
MobileHeader.args = {
  startOpen: true,
  walletStatus: {
    icon: <MetaMaskSVG />,
    address: mockAddress,
    chainId: 1,
    chainName: 'Ethereum Mainnet',
    logout: () => {},
  },
  query: {
    data: {
      organizations: [
        {
          id: 1,
          name: 'Example Org',
          circles: [
            {
              id: 2,
              name: 'Example Circle',
              users: [],
            },
          ],
        },
      ],
      claims_aggregate: {
        aggregate: {
          count: 1,
        },
      },
      profiles: [
        {
          id: 1,
          name: 'Ape',
        },
      ],
    },
  },
};
