// RainbowMagicConnector.ts

import { universalWalletConnector } from '@magiclabs/wagmi-connector';
import { Wallet, WalletDetailsParams } from '@rainbow-me/rainbowkit';
import { CreateWalletFn } from '@rainbow-me/rainbowkit/dist/wallets/Wallet';
import { optimism } from '@wagmi/core/chains';
import { createConnector as createWagmiConnector } from 'wagmi';
import { Chain } from 'wagmi/chains';

import { VITE_FE_ALCHEMY_API_KEY } from '../../config/env';

export const getRainbowMagicWallet = (
  options: Parameters<typeof rainbowMagicWallet>[0]
): CreateWalletFn => {
  //console.log({ magic: MAGIC_API_KEY, fe_alch: VITE_FE_ALCHEMY_API_KEY });
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
  iconUrl:
    'https://imagedelivery.net/rCPTJ2UGW1g_eRRwGVwKZw/5cffb206-1c03-40b6-ff05-c406e5a98900/avatar',
  iconBackground: '#6851FF',
  installed: true,
  downloadUrls: {},
  createConnector: (walletDetails: WalletDetailsParams) =>
    createWagmiConnector(config => ({
      ...universalWalletConnector({
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
