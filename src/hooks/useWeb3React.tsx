import { createContext, useContext, useEffect, useRef, useState } from 'react';

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

import useConnectedAddress from './useConnectedAddress';

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

// this provides a workaround for providers like Ganache that don't have an
// address set in useWeb3React by default
const FallbackAddressContext = createContext<
  [string | undefined, (address: string) => void]
>([undefined, () => {}]);

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
  const {
    provider,
    address: storeAddress,
    chainId,
  } = useAuthStore(pick(['provider', 'address', 'chainId']));
  const library = context.library || provider;

  const mounted = useRef(false);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const [signerAddress, setSignerAddress] = useContext(FallbackAddressContext);
  useEffect(() => {
    if (context.account || storeAddress) return;
    context.library
      ?.getSigner()
      .getAddress()
      .then((address: string) => {
        if (!mounted.current) return;
        setSignerAddress(address);
      });
  }, [library]);

  const address = context.account || storeAddress || signerAddress;

  return {
    ...context,
    library,
    active: !!address,
    chainId: context.chainId || chainId,
    account: address,
    setProvider,
    providerType,
    deactivate: context.active
      ? () => {
          context.deactivate();
          setProvider();
        }
      : () => setProvider(),
  };
}

export function Web3ReactProvider({
  children,
}: {
  children: any;
}): JSX.Element {
  const signerAddressState = useState<string | undefined>();
  return (
    <OriginalWeb3ReactProvider getLibrary={getLibrary}>
      <FallbackAddressContext.Provider value={signerAddressState}>
        {children}
        <Web3EventHooks />
      </FallbackAddressContext.Provider>
      <MagicModalFixer />
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
  const address = useConnectedAddress();

  useEffect(() => {
    const ethereum = (window as any).ethereum;
    if (!ethereum) return;

    // The "any" network will allow spontaneous network changes
    const provider = new Web3Provider(ethereum, 'any');

    provider.on('network', (_, oldNetwork) => {
      // When a Provider makes its initial connection, it emits a "network"
      // event with a null oldNetwork along with the newNetwork. So, if the
      // oldNetwork exists, it represents a changing network
      if (oldNetwork) window.location.reload();
    });
  });

  useEffect(() => {
    // accountsChanged fires when you change the account in MetaMask, but also
    // when you connect an account that hasn't been connected before. we don't
    // want to reload the page in that case, so we wait until we've already
    // connected some address to set up the listener.
    if (!address) return;

    // Web3Provider doesn't work with accountsChanged events:
    // https://github.com/ethers-io/ethers.js/issues/1396#issuecomment-806380431
    (window as any).ethereum?.on('accountsChanged', () => {
      window.location.reload();
    });
  }, [address]);

  return null;
};
