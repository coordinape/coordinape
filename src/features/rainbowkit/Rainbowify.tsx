import { ReactNode, useEffect, useState } from 'react';

import { darkTheme, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { wagmiConfig } from 'features/wagmi/config';
import { WagmiProvider, useAccount, useReconnect } from 'wagmi';
import '@rainbow-me/rainbowkit/styles.css';

import { useReloadCookieAuth } from 'hooks/useReloadCookieAuth';

import { RainbowKitSiweProvider } from './SiweProvider';

const Rainbow = ({ children }: { children: ReactNode }) => {
  return (
    <RainbowKitSiweProvider>
      <RainbowKitProvider theme={darkTheme()}>
        <>
          {children}
          {/* <ReconnectAuthAndWallet /> */}
        </>
      </RainbowKitProvider>
    </RainbowKitSiweProvider>
  );
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ReconnectAuthAndWallet = () => {
  useReloadCookieAuth();
  const { isConnected, isReconnecting } = useAccount();
  const [attemptedReconnect, setAttemptedReconnect] = useState(false);

  const { reconnect } = useReconnect();

  useEffect(() => {
    if (!isReconnecting && !attemptedReconnect && !isConnected) {
      setAttemptedReconnect(true);
      reconnect();
    }
  }, [isReconnecting, attemptedReconnect, isConnected]);

  return null;
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
