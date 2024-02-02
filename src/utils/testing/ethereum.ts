/*
This file was derived from the cypress TestProvider in `cypress/util/index.ts`.
However, there were some issues getting all the tests to pass using one single implementation.

This version should be used for all jest and non-cypress tests.
*/

/* eslint-disable no-console */
import { HDNode } from '@ethersproject/hdnode';
import Wallet from 'ethereumjs-wallet';
// @ts-expect-error
import ProviderEngine from 'web3-provider-engine';
// @ts-expect-error
import FiltersSubprovider from 'web3-provider-engine/subproviders/filters';
// @ts-expect-error
import NonceSubprovider from 'web3-provider-engine/subproviders/nonce-tracker';
// @ts-expect-error
import RpcSubProvider from 'web3-provider-engine/subproviders/rpc';
// @ts-expect-error
import WalletSubprovider from 'web3-provider-engine/subproviders/wallet';

import {
  SEED_PHRASE as DEFAULT_SEED,
  getAccountPath,
} from '../../../scripts/util/eth';

export class TestProvider {
  engine: ProviderEngine;
  mockChainId: string | undefined;
  calls: string[];

  constructor(url: string, accountIndex = 0, seed: string = DEFAULT_SEED) {
    const privateKey = deriveAccount(accountIndex, seed).privateKey.substring(
      2
    );

    this.calls = [];

    this.engine = new ProviderEngine();
    this.engine.addProvider(new FiltersSubprovider());
    this.engine.addProvider(new NonceSubprovider());
    this.engine.addProvider(
      new WalletSubprovider(
        //@ts-ignore
        new Wallet(new Uint8Array(Buffer.from(privateKey, 'hex'))),
        {}
      )
    );
    this.engine.addProvider(new RpcSubProvider({ rpcUrl: url }));
    this.engine.start();
  }

  sendAsync(params: any, callback: (error: any, result: any) => void) {
    const { method } = params;
    this.calls.push(method);
    if (method === 'eth_chainId' && this.mockChainId) {
      return callback(undefined, {
        id: params.id,
        jsonrpc: '2.0',
        result: this.mockChainId,
      });
    }
    if (method === 'personal_sign') {
      // shim for ganache, which has a different name for this method
      //args[0].method = 'eth_sign';
    }
    if (typeof method === 'object') {
      this.engine.sendAsync([method]);
      console.warn(
        'Nested JSON-RPC command: ' + JSON.stringify(params, null, 2)
      );
      return;
    }
    this.engine.sendAsync(params, callback);
  }

  async request({ method, params }: { method: string; params: any[] }) {
    return new Promise((res, rej) => {
      this.sendAsync({ method, params }, (error, result) => {
        if (error) rej(error);
        else res(result.result);
      });
    });
  }

  on(...args: any[]) {
    return this.engine.on(...args);
  }
}
export const deriveAccount = (index = 0, seed: string = DEFAULT_SEED) => {
  return HDNode.fromMnemonic(seed).derivePath(getAccountPath(index));
};
