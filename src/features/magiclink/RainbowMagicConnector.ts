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
    'https://media.licdn.com/dms/image/v2/D4E0BAQGorzUgKSt_lw/company-logo_200_200/company-logo_200_200/0/1719257630816/magiclabs_inc_logo?e=1733961600&v=beta&t=f_KnNL86G_YM89WCulQzQ2KsqpLoy6SLa6U_SaCHCFo',
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
