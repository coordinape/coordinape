/* eslint-disable no-console */
import { useEffect, useRef, useState } from 'react';

import {
  RainbowKitProvider,
  RainbowKitAuthenticationProvider,
  ConnectButton,
} from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { getAuthToken } from 'features/auth/token';
import { reloadAuthFromCookie } from 'features/auth/useSavedAuth';
import {
  authState,
  authenticationAdapter,
  setAuthState,
} from 'features/rainbowkit/siwe';
import { wagmiConfig } from 'features/wagmi/config';
import { useAccount, WagmiProvider } from 'wagmi';
import '@rainbow-me/rainbowkit/styles.css';

import { Text } from 'ui';

const Rainbow = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | undefined>(getAuthToken(false));
  const renderCount = useRef(0);

  useEffect(() => {
    renderCount.current += 1;
  });

  const state = authState;

  const account = useAccount();

  // if we have a connected wallet and auth token in memory is null, reload from cookie
  useEffect(() => {
    console.log({ token, account, state });
    if (token) {
      if (account) {
        setAuthState('authenticated');
        return;
      } else {
        setAuthState('unauthenticated');
      }
    } else {
      console.log('trying to reload auth from cookie');
      if (reloadAuthFromCookie()) {
        setAuthState('authenticated');
        setToken(getAuthToken(false));
      } else {
        console.log('no auth token in cookie');
        setAuthState('unauthenticated');
      }
    }
  }, [account, token]);

  return (
    <RainbowKitAuthenticationProvider
      adapter={authenticationAdapter}
      status={state}
    >
      <RainbowKitProvider>
        {/* DEBUG */}
        <Text>account: {account.address}</Text>
        <p>This component has rendered {renderCount.current} times</p>
        <Text>auth token: {token}</Text>

        <ConnectButton />
        {children}
      </RainbowKitProvider>
    </RainbowKitAuthenticationProvider>
  );
};

export const Rainbowify = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient();
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <Rainbow>{children}</Rainbow>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
