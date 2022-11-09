import { ReactElement, useEffect } from 'react';

import { ComponentStory, ComponentMeta } from '@storybook/react';
import { SnackbarProvider } from 'notistack';
import { QueryClient, QueryClientProvider } from 'react-query';
import { MemoryRouter } from 'react-router-dom';
import { RecoilRoot, useRecoilState } from 'recoil';

import { rApiManifest } from 'recoilState';

import { MobileHeader } from './MobileHeader';

const queryClient = new QueryClient();

const mockManifest = {
  active_epochs: [],
  circles: [],
  myUsers: [],
  profile: { id: 1, address: '0x0' },
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
  <MobileHeader {...args} />
);

export const Default = Template.bind({});
