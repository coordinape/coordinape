import { useState } from 'react';

import { Web3Provider } from '@ethersproject/providers';
import {
  useWeb3React as useOriginalWeb3React,
  Web3ReactProvider as OriginalWeb3ReactProvider,
} from '@web3-react/core';
import type { Web3ReactContextInterface } from '@web3-react/core/dist/types';

import { AuthContext } from 'hooks/login';
import type { AuthStep } from 'hooks/login';

export function useWeb3React<T = any>(
  key?: string | undefined
): Web3ReactContextInterface<T> {
  // x = in use
  // x connector?: AbstractConnector;
  // x library?: T;
  // x chainId?: number;
  // x account?: null | string;
  // x active: boolean;
  // error?: Error;
  // x activate: (connector: AbstractConnector, onError?: (error: Error) => void, throwErrors?: boolean) => Promise<void>;
  // setError: (error: Error) => void;
  // x deactivate: () => void;

  // we'll still call this and pass through values if the user is logged in via web3-react
  return useOriginalWeb3React(key);

  // but if they're not, we also check our own global auth state (zustand?), and
  // if the user's logged in thru e.g. Magic, return an object with appropriate
  // values, e.g. a provider wrapped with ethers
}

export function Web3ReactProvider({
  children,
}: {
  children: any;
}): JSX.Element {
  const authStepState = useState<AuthStep>('connect');

  return (
    <OriginalWeb3ReactProvider getLibrary={getLibrary}>
      <AuthContext.Provider value={authStepState}>
        {children}
      </AuthContext.Provider>
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
