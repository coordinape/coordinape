import { ReactElement, Suspense, useEffect } from 'react';

import { ComponentStory, ComponentMeta } from '@storybook/react';
import { SnackbarProvider } from 'notistack';
import { QueryClient, QueryClientProvider } from 'react-query';
import { MemoryRouter } from 'react-router-dom';
import { RecoilRoot, useRecoilState } from 'recoil';

import { ReactComponent as MetaMaskSVG } from 'assets/svgs/wallet/metamask-color.svg';
import { rApiManifest } from 'recoilState';

import { MobileHeader } from './MobileHeader';

const queryClient = new QueryClient();

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
  useEffect(() => {
    setManifest(mockManifest);
  }, []);
  return manifest ? children : null;
};

export default {
  component: MobileHeader,
  decorators: [
    (Story: any) => (
      <>
        <RecoilRoot>
          <RecoilFixtures>
            <MemoryRouter>
              <SnackbarProvider maxSnack={3}>
                <QueryClientProvider client={queryClient}>
                  <Story />
                </QueryClientProvider>
              </SnackbarProvider>
            </MemoryRouter>
          </RecoilFixtures>
        </RecoilRoot>
      </>
    ),
  ],
} as ComponentMeta<typeof MobileHeader>;

const Template: ComponentStory<typeof MobileHeader> = args => (
  <Suspense fallback={null}>
    <MobileHeader {...args} />
  </Suspense>
);

export const Default = Template.bind({});
Default.args = {
  walletStatus: {
    icon: <MetaMaskSVG />,
    address: mockAddress,
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
    },
  },
};
