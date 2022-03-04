import { InjectedConnector } from '@web3-react/injected-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import { WalletLinkConnector } from '@web3-react/walletlink-connector';

import { INFURA_PROJECT_ID } from 'config/env';
import { supportedChainIds } from 'services/contracts';

export const MAINNET_RPC_URL = `https://mainnet.infura.io/v3/${INFURA_PROJECT_ID}`;

const injected = new InjectedConnector({ supportedChainIds });

export const makeWalletConnectConnector = () =>
  new WalletConnectConnector({
    rpc: { 1: MAINNET_RPC_URL },
  });

const walletlink = new WalletLinkConnector({
  url: MAINNET_RPC_URL,
  appName: 'Coordinape',
});

export const connectors = {
  injected,
  walletconnect: makeWalletConnectConnector(),
  walletlink,
};
