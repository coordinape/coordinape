import assert from 'assert';

import { atom, selector, useRecoilState } from 'recoil';

import { DebugLogger } from '../../common-lib/log';

import type { ProviderType } from './store';
import { setAuthToken } from './token';

const logger = new DebugLogger('auth');

export enum EConnectorNames {
  Injected = 'injected',
  WalletConnect = 'walletconnect',
  WalletLink = 'walletlink',
}

export interface IAuth {
  address?: string;
  connectorName?: EConnectorNames | ProviderType;
  id?: number;
  token?: string;
}

const updateToken = ({ token }: IAuth) => {
  logger.log('updateToken:', token);
  setAuthToken(token);
};

const AUTH_STORAGE_KEY = 'capeAuth2';

const getSavedAuth = (): IAuth => {
  try {
    const auth = localStorage.getItem(AUTH_STORAGE_KEY);
    assert(auth);
    return JSON.parse(auth);
  } catch {
    return {};
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
        if (!auth) auth = {};
        updateToken(auth);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth));
      });
    },
  ],
});

export const useSavedAuth = () => useRecoilState(rSavedAuth);
