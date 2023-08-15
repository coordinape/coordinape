import assert from 'assert';

import { AbstractConnector } from '@web3-react/abstract-connector';
import { InjectedConnector } from '@web3-react/injected-connector';
import { NetworkConnector } from '@web3-react/network-connector';
import { WalletLinkConnector } from '@web3-react/walletlink-connector';
import { loginSupportedChainIds } from 'common-lib/constants';

import { EConnectorNames } from 'config/constants';
import { INFURA_PROJECT_ID, WALLET_CONNECT_V2_PROJECT_ID } from 'config/env';

import { WalletConnectV2Connector } from './walletconnectv2';

const OPTIMISM_RPC_URL = `https://optimism-mainnet.infura.io/v3/${INFURA_PROJECT_ID}`;

const injected = new InjectedConnector({
  supportedChainIds: Object.keys(loginSupportedChainIds).map(n =>
    // This is the most type-safe way
    // way to handle this conversion to Numbers that the InjectedConnector
    // is expecting, since String.prototype.toString() is idempotent
    // (yay, something in javascript works the way you'd expect!)
    Number.parseInt(n.toString())
  ),
});

export const makeWalletConnectConnector = () => {
  /*
   * This is a bit of a hack but stops the requirement to upgrade web3-react to v8.
   * WalletConnect cannot switch chains, each chain requires a new connection.
   */
  const wc = new WalletConnectV2Connector({
    showQrModal: true,
    projectId: WALLET_CONNECT_V2_PROJECT_ID,
    chains: [10],
    rpcMap: { 10: OPTIMISM_RPC_URL },
  });
  return wc;
};

const walletlink = new WalletLinkConnector({
  url: OPTIMISM_RPC_URL,
  appName: 'Coordinape',
});

export const connectors: { [key in EConnectorNames]: AbstractConnector } = {
  [EConnectorNames.Injected]: injected,
  [EConnectorNames.WalletConnect]: makeWalletConnectConnector(),
  [EConnectorNames.WalletLink]: walletlink,
};

export const findConnectorName = (
  connector: AbstractConnector
): EConnectorNames => {
  // workaround for ganache
  if (connector instanceof NetworkConnector) return EConnectorNames.Injected;

  const match = Object.entries(connectors).find(
    ([, c]) => connector?.constructor === c.constructor
  );
  assert(match);
  return match[0] as EConnectorNames;
};
