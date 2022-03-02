import { InjectedConnector } from '@web3-react/injected-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import { WalletLinkConnector } from '@web3-react/walletlink-connector';

import { supportedNetworkIds, supportedNetworkURLs } from 'config/networks';

const POLLING_INTERVAL = 12000;

const injected = new InjectedConnector({
  supportedChainIds: supportedNetworkIds,
});

const walletconnect = new WalletConnectConnector({
  rpc: { 1: supportedNetworkURLs[1] },
  bridge: 'https://bridge.walletconnect.org',
  qrcode: true,
  pollingInterval: POLLING_INTERVAL,
});

const walletlink = new WalletLinkConnector({
  url: supportedNetworkURLs[1],
  appName: 'Coordinape',
});

export const connectors = { injected, walletconnect, walletlink };
