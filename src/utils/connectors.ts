// import { AbstractConnector } from '@web3-react/abstract-connector';
import { FortmaticConnector } from '@web3-react/fortmatic-connector';
import { InjectedConnector } from '@web3-react/injected-connector';
import { PortisConnector } from '@web3-react/portis-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import { WalletLinkConnector } from '@web3-react/walletlink-connector';

import {
  networkIds,
  supportedNetworkIds,
  supportedNetworkURLs,
} from 'config/networks';

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

const fortmatic = new FortmaticConnector({
  apiKey: process.env.REACT_APP_FORTMATIC_API_KEY as string,
  chainId: networkIds.MAINNET,
});

const portis = new PortisConnector({
  dAppId: process.env.REACT_APP_PORTIS_DAPP_ID as string,
  networks: supportedNetworkIds,
});

const walletlink = new WalletLinkConnector({
  url: supportedNetworkURLs[1],
  appName: 'Coordinape',
});

export const connectors = {
  injected,
  walletconnect,
  walletlink,
  fortmatic,
  portis,
};
