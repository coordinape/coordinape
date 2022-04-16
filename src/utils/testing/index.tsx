import { ReactElement, Suspense, useEffect } from 'react';

import { JsonRpcProvider, Web3Provider } from '@ethersproject/providers';
import { Web3ReactProvider, useWeb3React } from '@web3-react/core';
import { NetworkConnector } from '@web3-react/network-connector';
import { SnackbarProvider } from 'notistack';
import { QueryClient, QueryClientProvider } from 'react-query';
import { MemoryRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';

import { ThemeProvider } from '@material-ui/styles';

import {
  HARDHAT_CHAIN_ID,
  HARDHAT_PORT,
  HARDHAT_GANACHE_CHAIN_ID,
  HARDHAT_GANACHE_PORT,
} from 'config/env';
import { createTheme } from 'theme';

const theme = createTheme();

type TestWrapperProps = {
  children: ReactElement;
  getLibrary?: (provider: any) => any; // FIXME
  withWeb3?: boolean;
};

const defaultGetLibrary = (provider: any) => new Web3Provider(provider);

const chainId = process.env.TEST_ON_HARDHAT_NODE
  ? HARDHAT_CHAIN_ID
  : HARDHAT_GANACHE_CHAIN_ID;
const port = process.env.TEST_ON_HARDHAT_NODE
  ? HARDHAT_PORT
  : HARDHAT_GANACHE_PORT;
const rpcUrl = `http://localhost:${port}`;

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
  getLibrary = defaultGetLibrary,
  withWeb3 = false,
}: TestWrapperProps) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return (
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        <SnackbarProvider>
          <Web3ReactProvider getLibrary={getLibrary}>
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

export const provider = new JsonRpcProvider(rpcUrl);

export const takeSnapshot = async (): Promise<string> => {
  return (await provider.send('evm_snapshot', [])) as string;
};

export const restoreSnapshot = async (snapshotId?: string) => {
  if (!snapshotId) {
    console.error('No snapshot ID provided; not reverting.');
    return;
  }
  return provider.send('evm_revert', [snapshotId]);
};

export * from './recoil';
