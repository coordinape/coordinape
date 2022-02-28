import { InjectedConnector } from '@web3-react/injected-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import { WalletLinkConnector } from '@web3-react/walletlink-connector';

import { HARDHAT_CHAIN_ID, INFURA_PROJECT_ID } from 'config/env';

const POLLING_INTERVAL = 12000;
const MAINNET_RPC_URL = `https://mainnet.infura.io/v3/${INFURA_PROJECT_ID}`;

const injected = new InjectedConnector({
  supportedChainIds: [1, HARDHAT_CHAIN_ID],
});

const walletconnect = new WalletConnectConnector({
  rpc: { 1: MAINNET_RPC_URL },
  bridge: 'https://bridge.walletconnect.org',
  qrcode: true,
  pollingInterval: POLLING_INTERVAL,
});

const walletlink = new WalletLinkConnector({
  url: MAINNET_RPC_URL,
  appName: 'Coordinape',
});

export const connectors = { injected, walletconnect, walletlink };
