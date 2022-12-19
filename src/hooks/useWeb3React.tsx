import { useEffect } from 'react';

import type { JsonRpcProvider } from '@ethersproject/providers';
import { Web3Provider } from '@ethersproject/providers';
import {
  useWeb3React as useOriginalWeb3React,
  Web3ReactProvider as OriginalWeb3ReactProvider,
} from '@web3-react/core';
import type { Web3ReactContextInterface } from '@web3-react/core/dist/types';
import { useAuthStore } from 'features/auth';
import { MagicModalFixer } from 'features/auth/magic';
import type { ProviderType } from 'features/auth/store';
import { pick } from 'lodash/fp';

// connector?: AbstractConnector;
// library?: T;
// chainId?: number;
// account?: null | string;
// active: boolean;
// error?: Error;
// activate: (connector: AbstractConnector, onError?: (error: Error) => void, throwErrors?: boolean) => Promise<void>;
// setError: (error: Error) => void;
// deactivate: () => void;
export type UseWeb3ReactReturnType<T> = Web3ReactContextInterface<T> & {
  setProvider: (provider?: JsonRpcProvider, type?: ProviderType) => void;
  providerType: ProviderType | undefined;
};

export function useWeb3React<T = any>(
  key?: string | undefined
): UseWeb3ReactReturnType<T> {
  // pass through values if the user is logged in via web3-react
  const context = useOriginalWeb3React(key);

  // if they're not, check our own global auth state, and
  // if the user's logged in thru a different means, construct return values
  // so that hook consumers don't have to change their behavior

  const setProvider = useAuthStore(state => state.setProvider);
  const providerType = useAuthStore(state => state.providerType);
  const { provider, address, chainId } = useAuthStore(
    pick(['provider', 'address', 'chainId'])
  );
  const library = context.library || provider;

  return {
    ...context,
    library,
    active: context.active || !!address,
    chainId: context.chainId || chainId,
    account: context.account || address,
    setProvider,
    providerType,
    deactivate: context.active ? context.deactivate : () => setProvider(),
  };
}

export function Web3ReactProvider({
  children,
}: {
  children: any;
}): JSX.Element {
  return (
    <OriginalWeb3ReactProvider getLibrary={getLibrary}>
      {children}
      <MagicModalFixer />
      <Web3EventHooks />
    </OriginalWeb3ReactProvider>
  );
}

function getLibrary(provider: any): Web3Provider {
  // This checks specifically whether the provider is
  // an instance of a Web3Provider by checking the existence of this
  // uniquely named method. Normally, we would want to use `instanceof`
  // to check if a provider conforms to a specific class, but because
  // some providers are injected into the window from other contexts,
  // this check will fail, since those providers aren't derived from
  // the same prototype tree.
  const library =
    typeof provider.jsonRpcFetchFunc !== 'undefined'
      ? provider
      : new Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
}

const Web3EventHooks = () => {
  useEffect(() => {
    const ethereum = (window as any).ethereum;
    if (ethereum) {
      // The "any" network will allow spontaneous network changes
      const provider = new Web3Provider(ethereum, 'any');

      provider.on('network', (_, oldNetwork) => {
        // When a Provider makes its initial connection, it emits a "network"
        // event with a null oldNetwork along with the newNetwork. So, if the
        // oldNetwork exists, it represents a changing network
        if (oldNetwork) {
          window.location.reload();
        }
      });

      // Web3Provider doesn't work with accountsChanged events:
      // https://github.com/ethers-io/ethers.js/issues/1396#issuecomment-806380431
      ethereum.on('accountsChanged', () => {
        // If account changes, reload!
        window.location.reload();
      });
    }
  }, []);

  return null;
};
