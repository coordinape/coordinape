import '@decent.xyz/box-ui/index.css';

import { BoxHooksContextProvider } from '@decent.xyz/box-hooks';
import { WagmiProvider } from 'wagmi';

import { DECENT_XYZ_API_KEY } from 'config/env';

import { wagmiConfig } from './config';
import { SwapComponent } from './SwapComponent';

export function DecentSwap() {
  return (
    <WagmiProvider config={wagmiConfig}>
      <BoxHooksContextProvider apiKey={DECENT_XYZ_API_KEY}>
        <SwapComponent />
      </BoxHooksContextProvider>
    </WagmiProvider>
  );
}
