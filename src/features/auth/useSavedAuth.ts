import assert from 'assert';

import { atom, selector, useRecoilValue } from 'recoil';

import type { ProviderType } from './store';
import { setAuthToken } from './token';

export enum EConnectorNames {
  Injected = 'injected',
  WalletConnect = 'walletconnect',
  WalletLink = 'walletlink',
}

export interface IAuth {
  address?: string;
  connectorName?: EConnectorNames | ProviderType;
  authTokens: { [k: string]: string | undefined };
}

const updateToken = ({ address, authTokens }: IAuth) => {
  const token = address && authTokens[address];
  setAuthToken(token);
};

const AUTH_STORAGE_KEY = 'capeAuth';

const saveAuth = (auth: IAuth) =>
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth));

const getSavedAuth = (): IAuth => {
  try {
    const auth = localStorage.getItem(AUTH_STORAGE_KEY);
    assert(auth);
    return JSON.parse(auth);
  } catch {
    return {
      authTokens: {},
    };
  }
};

export const rSavedAuth = atom({
  key: 'rSavedAuth',
  default: selector({
    key: 'rSavedAuth/default',
    get: () => {
      const auth = getSavedAuth();
      updateToken(auth);
      return auth;
    },
  }),
  effects_UNSTABLE: [
    ({ onSet }) => {
      onSet(auth => {
        updateToken(auth);
        saveAuth(auth);
      });
    },
  ],
});

export const useSavedAuth = () => useRecoilValue(rSavedAuth);
