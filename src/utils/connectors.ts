import { AbstractConnector } from '@web3-react/abstract-connector';
import { InjectedConnector } from '@web3-react/injected-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import { WalletLinkConnector } from '@web3-react/walletlink-connector';
import { supportedChainIds } from 'lib/vaults';

import { EConnectorNames } from 'config/constants';
import { INFURA_PROJECT_ID } from 'config/env';

import { SafeAppConnector } from './safeAppConnector';

export const MAINNET_RPC_URL = `https://mainnet.infura.io/v3/${INFURA_PROJECT_ID}`;
export const GOERLI_RPC_URL = `https://goerli.infura.io/v3/${INFURA_PROJECT_ID}`;

const injected = new InjectedConnector({
  supportedChainIds: [...supportedChainIds, 1].map(n =>
    // This is the most type-safe way
    // way to handle this conversion to Numbers that the InjectedConnector
    // is expecting, since String.prototype.toString() is idempotent
    // (yay, something in javascript works the way you'd expect!)
    Number.parseInt(n.toString())
  ),
});

export const makeWalletConnectConnector = () =>
  new WalletConnectConnector({
    rpc: { 1: MAINNET_RPC_URL, 5: GOERLI_RPC_URL },
  });

const walletlink = new WalletLinkConnector({
  url: MAINNET_RPC_URL,
  appName: 'Coordinape',
});

const safeMultisigConnector = new SafeAppConnector();

export const connectors: { [key in EConnectorNames]: AbstractConnector } = {
  [EConnectorNames.Injected]: injected,
  [EConnectorNames.WalletConnect]: makeWalletConnectConnector(),
  [EConnectorNames.WalletLink]: walletlink,
  [EConnectorNames.SafeAppConnector]: safeMultisigConnector,
};
