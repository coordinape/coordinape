import type WalletConnectProvider from '@walletconnect/ethereum-provider';
import { EthereumProviderOptions } from '@walletconnect/ethereum-provider/dist/types/EthereumProvider';
import { AbstractConnector } from '@web3-react/abstract-connector';
import { ConnectorUpdate } from '@web3-react/types';

import { supportedChainIds } from '../cosoul/contracts';

export class WalletConnectV2Connector extends AbstractConnector {
  provider?: typeof WalletConnectProvider.prototype;

  private readonly options: EthereumProviderOptions;

  constructor(options: EthereumProviderOptions) {
    super({
      supportedChainIds: Object.keys(options.rpcMap || {}).map(k => Number(k)),
    });

    this.options = options;
  }

  static clearStorage = (storage: Storage) => {
    storage.removeRegExp(new RegExp('^wc@2:'));
  };

  activate = async (): Promise<ConnectorUpdate<string | number>> => {
    const provider = await import('@walletconnect/ethereum-provider').then(
      module => {
        return module.default.init({
          optionalChains: [1, ...supportedChainIds.map(i => Number(i))], // TODO: this is weird
          projectId: this.options.projectId,
          rpcMap: this.options.rpcMap || {},
          chains: this.options.chains,
          showQrModal: true,
          // RPCs may not support the `test` method used for the ping.
          disableProviderPing: true,
          methods: ['eth_sendTransaction', 'personal_sign'],
          optionalMethods: [
            'eth_accounts',
            'eth_requestAccounts',
            'eth_sendRawTransaction',
            'eth_signTransaction',
            'wallet_switchEthereumChain',
            'wallet_addEthereumChain',
          ],
          events: ['chainChanged', 'accountsChanged'],
          optionalEvents: ['disconnect'],
        });
      },
    );

    const accounts = await provider.enable();

    provider.on('accountsChanged', this.handleAccountsChanged);
    provider.on('chainChanged', this.handleChainChanged);
    provider.on('disconnect', this.handleDisconnect);

    this.provider = provider;

    return {
      chainId: provider.chainId,
      account: accounts[0],
      provider,
    };
  };

  getProvider = async (): Promise<any> => {
    if (!this.provider) {
      throw new Error('Provider is undefined');
    }
    return this.provider;
  };

  getChainId = async (): Promise<string | number> => {
    if (!this.provider) {
      throw new Error('Provider is undefined');
    }
    return this.provider.chainId;
  };

  getAccount = async (): Promise<string | null> => {
    if (!this.provider) {
      throw new Error('Provider is undefined');
    }
    return this.provider.accounts[0];
  };

  getWalletName = (): string | undefined => {
    return this.provider?.session?.peer.metadata.name;
  };

  deactivate = (): void => {
    if (!this.provider) {
      return;
    }
    this.emitDeactivate();

    this.provider
      .removeListener('accountsChanged', this.handleAccountsChanged)
      .removeListener('chainChanged', this.handleChainChanged)
      .removeListener('disconnect', this.handleDisconnect)
      .disconnect();
  };

  handleAccountsChanged = (accounts: string[]): void => {
    this.emitUpdate({ account: accounts[0] });
  };

  handleChainChanged = (chainId: string | number): void => {
    this.emitUpdate({ chainId });
  };

  handleDisconnect = (): void => {
    if (!this.provider) {
      throw new Error('Provider is undefined');
    }
    this.deactivate();
  };
}
