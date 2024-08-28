import { ReactNode } from 'react';

import { darkTheme, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { wagmiConfig } from 'features/wagmi/config';
import { WagmiProvider } from 'wagmi';
import '@rainbow-me/rainbowkit/styles.css';

import { RainbowKitSiweProvider } from './SiweProvider';

const Rainbow = ({ children }: { children: ReactNode }) => {
  return (
    <RainbowKitSiweProvider>
      <RainbowKitProvider theme={darkTheme()}>
        <>{children}</>
      </RainbowKitProvider>
    </RainbowKitSiweProvider>
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
