import { useMemo } from 'react';

import type { ProviderType } from './store';
import { setAuthToken } from './token';

export enum EConnectorNames {
  Injected = 'injected',
  WalletConnect = 'walletconnect',
  WalletLink = 'walletlink',
}

type IAuthValue = {
  connectorName?: EConnectorNames | ProviderType;
  id?: number;
  token?: string;
};
export interface IAuth {
  recent?: string;
  data: { [address: string]: IAuthValue };
}

const AUTH_STORAGE_KEY = 'capeAuth3';

const emptyData = () => ({ data: {} });

const getAllData = (): IAuth => {
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!stored) return emptyData();
    return JSON.parse(stored);
  } catch {
    return emptyData();
  }
};

// only exporting for testing purposes
export const saveAllData = (allData: IAuth) => {
  localStorage.removeItem('hiddenOrgs');
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(allData));
};

type UseSavedAuthReturn = {
  savedAuth: IAuthValue;
  setSavedAuth: (address: string, data: IAuthValue) => void;
  getAndUpdate: (address: string) => IAuthValue;
  clearSavedAuth: () => void;
};
export const useSavedAuth = (): UseSavedAuthReturn => {
  const { recent, data } = getAllData();

  const savedAuth = useMemo(() => {
    const auth = recent ? data[recent] ?? {} : {};
    setAuthToken(auth.token);
    return auth;
  }, [recent]);

  const setSavedAuth = (address: string, data: IAuthValue) => {
    address = address.toLowerCase();

    // data.token will be null when this is called to log out
    setAuthToken(data.token);

    const previous = getAllData();
    const updated = {
      recent: address,
      data: { ...previous.data, [address]: data },
    };
    saveAllData(updated);
  };

  // this is needed during login when the most-recent account is not the one
  // we're currently connected to, e.g. the user switched accounts in MetaMask
  // in between Coordinape sessions. all other cases should use savedAuth
  // instead
  const getAndUpdate = (address: string) => {
    address = address.toLowerCase();
    if (address !== recent) saveAllData({ recent: address, data });
    return data[address.toLowerCase()] ?? {};
  };

  const clearSavedAuth = () => saveAllData(emptyData());

  return { savedAuth, setSavedAuth, getAndUpdate, clearSavedAuth };
};
