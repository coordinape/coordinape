import { useMemo } from 'react';

import Cookies from 'js-cookie';

import { getAllData, clearSavedAuth, AUTH_COOKIE } from './helpers';
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

function getCookieDomain(): string {
  const url = new URL(window.origin).hostname;

  if (url.includes('vercel.app')) {
    return url;
  }

  const domainParts = url.split('.').reverse();

  if (domainParts.length < 2) {
    return domainParts[0];
  }

  return `${domainParts[1]}.${domainParts[0]}`;
}

export const emptyData = () => ({ data: {} });

// only exporting for testing purposes
export const saveAllData = (allData: IAuth) => {
  const cookieDomain = getCookieDomain();
  Cookies.set(AUTH_COOKIE, JSON.stringify(allData), {
    expires: 365,
    sameSite: 'strict',
    domain: cookieDomain,
  });
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

  return { savedAuth, setSavedAuth, getAndUpdate, clearSavedAuth };
};
