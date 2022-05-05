/* eslint-disable no-console */
import { HDNode } from '@ethersproject/hdnode';
import { Web3Provider } from '@ethersproject/providers';
import Wallet from 'ethereumjs-wallet';
import ProviderEngine from 'web3-provider-engine';
import FiltersSubprovider from 'web3-provider-engine/subproviders/filters';
import NonceSubprovider from 'web3-provider-engine/subproviders/nonce-tracker';
import RpcSubProvider from 'web3-provider-engine/subproviders/rpc';
import WalletSubprovider from 'web3-provider-engine/subproviders/wallet';

import {
  SEED_PHRASE as DEFAULT_SEED,
  getAccountPath,
} from '../../scripts/util/eth';

/**
 * A Provider that mocks metamask's interface _just enough_ to get by in our
 * application's lifecycle
 */
export class TestProvider {
  engine: ProviderEngine;
  constructor(url: string, accountIndex = 0, seed: string = DEFAULT_SEED) {
    const privateKey = HDNode.fromMnemonic(seed)
      .derivePath(getAccountPath(accountIndex))
      .privateKey.substring(2);

    this.engine = new ProviderEngine();
    this.engine.addProvider(new FiltersSubprovider());
    this.engine.addProvider(new NonceSubprovider());
    this.engine.addProvider(
      new WalletSubprovider(new Wallet(new Buffer(privateKey, 'hex')), {})
    );
    this.engine.addProvider(new RpcSubProvider({ rpcUrl: url }));
    this.engine.start();
  }

  sendAsync(...args) {
    const [{ method }] = args;
    if (method === 'eth_requestAccounts') {
      // shim this metamask-specific method and just return the accounts array
      args[0].method = 'eth_accounts';
      args[0].params = [];
    }
    if (method === 'personal_sign') {
      // shim for ganache, which has a different name for this method
      //args[0].method = 'eth_sign';
    }
    console.error('request log: ', args[0].method);
    if (typeof method === 'object') {
      throw new Error(
        'Nested JSON-RPC command: ' + JSON.stringify(args, null, 2)
      );
    }
    this.engine.sendAsync(...args);
  }
}

export const injectWeb3 = (win: any) => {
  const provider = new Web3Provider(new TestProvider('http://localhost:8546'));
  if (!win.ethereum) {
    Object.defineProperty(win, 'ethereum', { value: provider });
  } else {
    console.warn('ethereum already enabled: ', win.ethereum);
  }
};
