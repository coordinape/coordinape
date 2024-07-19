import { useEffect, useState, ReactNode } from 'react';

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

import { useRefresh } from './useRefresh';

const Rainbow = ({ children }: { children: ReactNode }) => {
  const refreshKey = useRefresh();

  useEffect(() => {
    // refresh auth token
    const t = getAuthToken(false);
    if (t != token) {
      setToken(t);
    }
  }, [refreshKey]);

  const [token, setToken] = useState<string | undefined>(getAuthToken(false));
  const state = authState;

  const account = useAccount();

  // if we have a connected wallet and auth token in memory is null, reload from cookie
  useEffect(() => {
    if (token) {
      if (account) {
        setAuthState('authenticated');
        return;
      } else {
        setAuthState('unauthenticated');
      }
    } else {
      if (reloadAuthFromCookie()) {
        setAuthState('authenticated');
        setToken(getAuthToken(false));
      } else {
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
        {/* = = = = = = = = = = DEBUG ==========  */}
        <Text>account: {account.address}</Text>
        <p>Refresh count: {refreshKey}</p>
        <Text>auth token: {token}</Text>
        <ConnectButton />
        {/* = = = = = = = = = = END DEBUG ==========  */}

        {children}
      </RainbowKitProvider>
    </RainbowKitAuthenticationProvider>
  );
};

export const Rainbowify = ({ children }: { children: ReactNode }) => {
  const queryClient = new QueryClient();
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <Rainbow>{children}</Rainbow>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
