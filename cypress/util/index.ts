import ProviderEngine from 'web3-provider-engine';
import RpcSubProvider from 'web3-provider-engine/subproviders/rpc';

/**
 * A Provider that mocks metamask's interface _just enough_ to get by in our
 * application's lifecycle
 */
export class TestProvider {
  engine: ProviderEngine;
  constructor(url: string) {
    this.engine = new ProviderEngine();
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
    console.error('request log: ', args[0].method);
    if (typeof method === 'object') {
      throw new Error(
        'Nested JSON-RPC command: ' + JSON.stringify(args, null, 2)
      );
    }
    this.engine.sendAsync(...args);
  }
}
