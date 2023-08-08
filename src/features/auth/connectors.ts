import assert from 'assert';

import { AbstractConnector } from '@web3-react/abstract-connector';
import { InjectedConnector } from '@web3-react/injected-connector';
import { NetworkConnector } from '@web3-react/network-connector';
import { WalletLinkConnector } from '@web3-react/walletlink-connector';
import { loginSupportedChainIds } from 'common-lib/constants';

import { EConnectorNames } from 'config/constants';
import { INFURA_PROJECT_ID, WALLET_CONNECT_V2_PROJECT_ID } from 'config/env';

import { WalletConnectV2Connector } from './walletconnectv2';

const MAINNET_RPC_URL = `https://mainnet.infura.io/v3/${INFURA_PROJECT_ID}`;
// const GOERLI_RPC_URL = `https://goerli.infura.io/v3/${INFURA_PROJECT_ID}`;

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
  try {
    const wc = new WalletConnectV2Connector({
      showQrModal: true,
      projectId: WALLET_CONNECT_V2_PROJECT_ID,
      chains: [1 /*, 5*/], // TODO: this is kinda sloppy
      rpcMap: { 1: MAINNET_RPC_URL /*, 5: GOERLI_RPC_URL */ },
    });
    // eslint-disable-next-line no-console
    console.log('made the wc', wc);
    return wc;
  } catch (e: any) {
    // eslint-disable-next-line no-console
    console.log('WC.err', e);
    throw e;
  }
};

const walletlink = new WalletLinkConnector({
  url: MAINNET_RPC_URL,
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
