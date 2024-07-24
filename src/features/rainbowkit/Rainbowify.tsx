import { ReactNode } from 'react';

import { darkTheme, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { wagmiConfig } from 'features/wagmi/config';
import { WagmiProvider } from 'wagmi';
import '@rainbow-me/rainbowkit/styles.css';

import { RainbowKitSiweProvider } from './SiweProvider';

const Rainbow = ({ children }: { children: ReactNode }) => {
  // const refreshKey = useRefresh();
  //
  // useEffect(() => {
  //   // refresh auth token
  //   const t = getAuthToken(false);
  //   if (t != token) {
  //     setToken(t);
  //   }
  // }, [refreshKey]);

  // const account = useAccount();

  // // if we have a connected wallet and auth token in memory is null, reload from cookie
  // useEffect(() => {
  //   // if (token) {
  //   //   // if (account) {
  //   //   //   setAuthState('authenticated');
  //   //   //   return;
  //   //   // } else {
  //   //   //   setAuthState('unauthenticated');
  //   //   // }
  //   // } else {
  //   //   // if (reloadAuthFromCookie()) {
  //   //   //   // TODO: this needs to work
  //   //   //   setAuthState('authenticated');
  //   //   //   setToken(getAuthToken(false));
  //   //   // } else {
  //   //   //   setAuthState('unauthenticated');
  //   //   // }
  //   // }
  // }, [account, token]);

  return (
    <RainbowKitSiweProvider>
      <RainbowKitProvider theme={darkTheme()}>
        {/* = = = = = = = = = = DEBUG ==========  */}
        {/* <p>account: {account.address}</p> */}
        {/*<p>Refresh count: {refreshKey}</p>*/}
        {/*<p>auth token: {token}</p>*/}
        {/* = = = = = = = = = = END DEBUG ==========  */}

        {children}
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
