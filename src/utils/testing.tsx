import { ReactElement, Suspense, useEffect } from 'react';

import { JsonRpcProvider, Web3Provider } from '@ethersproject/providers';
import { Web3ReactProvider, useWeb3React } from '@web3-react/core';
import { NetworkConnector } from '@web3-react/network-connector';
import { SnackbarProvider } from 'notistack';
import { RecoilRoot } from 'recoil';

import {
  HARDHAT_CHAIN_ID,
  HARDHAT_PORT,
  HARDHAT_GANACHE_CHAIN_ID,
  HARDHAT_GANACHE_PORT,
} from 'config/env';

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

const Web3Activator = ({
  children,
  enabled,
}: {
  children: ReactElement;
  enabled: boolean;
}) => {
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
  return (
    <RecoilRoot>
      <SnackbarProvider>
        <Web3ReactProvider getLibrary={getLibrary}>
          <Web3Activator enabled={withWeb3}>
            <Suspense fallback="Loading...">{children}</Suspense>
          </Web3Activator>
        </Web3ReactProvider>
      </SnackbarProvider>
    </RecoilRoot>
  );
};

const provider = new JsonRpcProvider(rpcUrl);

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
