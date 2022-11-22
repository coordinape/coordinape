import { ReactElement, Suspense, useEffect } from 'react';

import { NetworkConnector } from '@web3-react/network-connector';
import { SnackbarProvider } from 'notistack';
import { QueryClient, QueryClientProvider } from 'react-query';
import { MemoryRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';

import { ThemeProvider } from '@material-ui/styles';

import { Web3ReactProvider, useWeb3React } from 'hooks/useWeb3React';
import { createTheme } from 'theme';

import {
  chainId,
  rpcUrl,
  provider,
  takeSnapshot,
  restoreSnapshot,
} from './provider';
export { provider, takeSnapshot, restoreSnapshot };

const theme = createTheme();

type TestWrapperProps = {
  children: ReactElement;
  getLibrary?: (provider: any) => any; // FIXME
  withWeb3?: boolean;
  queryClientCallback?: (queryClient: QueryClient) => void;
};

const connector = new NetworkConnector({
  urls: { [chainId]: rpcUrl },
});

type Web3ActivatorProps = { children: ReactElement; enabled: boolean };
const Web3Activator = ({ children, enabled }: Web3ActivatorProps) => {
  const web3 = useWeb3React();
  useEffect(() => {
    if (enabled) web3.activate(connector);
  }, []);
  return children;
};

export const TestWrapper = ({
  children,
  withWeb3 = false,
  queryClientCallback,
}: TestWrapperProps) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  queryClientCallback?.(queryClient);

  return (
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        <SnackbarProvider>
          <Web3ReactProvider>
            <Web3Activator enabled={withWeb3}>
              <MemoryRouter>
                <ThemeProvider theme={theme}>
                  <Suspense fallback="Suspended...">{children}</Suspense>
                </ThemeProvider>
              </MemoryRouter>
            </Web3Activator>
          </Web3ReactProvider>
        </SnackbarProvider>
      </QueryClientProvider>
    </RecoilRoot>
  );
};

export * from './recoil';
