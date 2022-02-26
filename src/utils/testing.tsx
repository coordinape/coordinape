import { ReactElement, Suspense, useEffect } from 'react';

import { Web3Provider } from '@ethersproject/providers';
import { Web3ReactProvider, useWeb3React } from '@web3-react/core';
import { NetworkConnector } from '@web3-react/network-connector';
import { SnackbarProvider } from 'notistack';
import { RecoilRoot } from 'recoil';

type TestWrapperProps = {
  children: ReactElement;
  getLibrary?: (provider: any) => any; // FIXME
  withWeb3?: boolean;
};

const defaultGetLibrary = (provider: any) => new Web3Provider(provider);

const connector = new NetworkConnector({
  urls: { 1337: `http://localhost:${process.env.HARDHAT_GANACHE_PORT}` },
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
