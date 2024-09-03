// RainbowMagicConnector.ts

import { dedicatedWalletConnector } from '@magiclabs/wagmi-connector';
import { Wallet, WalletDetailsParams } from '@rainbow-me/rainbowkit';
import { CreateWalletFn } from '@rainbow-me/rainbowkit/dist/wallets/Wallet';
import { optimism } from '@wagmi/core/chains';
import { createConnector as createWagmiConnector } from 'wagmi';
import { Chain } from 'wagmi/chains';

import { VITE_FE_ALCHEMY_API_KEY } from '../../config/env';

export const getRainbowMagicWallet = (
  options: Parameters<typeof rainbowMagicWallet>[0]
): CreateWalletFn => {
  return () => rainbowMagicWallet(options);
};

export const rainbowMagicWallet = ({
  chains,
  apiKey,
}: {
  chains: Chain[];
  apiKey: string;
}): Wallet => ({
  id: 'magic',
  name: 'Magic',
  rdns: 'Magic',
  iconUrl: 'https://dashboard.magic.link/images/logo.svg',
  iconBackground: '#fff',
  installed: true,
  downloadUrls: {},
  createConnector: (walletDetails: WalletDetailsParams) =>
    createWagmiConnector(config => ({
      ...dedicatedWalletConnector({
        chains: chains,
        options: {
          apiKey: apiKey,
          magicSdkConfiguration: {
            network: {
              rpcUrl: `https://opt-mainnet.g.alchemy.com/v2/${VITE_FE_ALCHEMY_API_KEY}`,
              chainId: optimism.id,
            },
          },
          //...Other options (check out full API below)
        },
      })(config),
      ...walletDetails,
    })),
});
