import Cookies from 'js-cookie';

import { setAuthToken } from './token';
import { emptyData, IAuth, saveAllData } from './useSavedAuth';

export const AUTH_COOKIE = 'coordinape_auth_cookie';

export const clearSavedAuth = () => saveAllData(emptyData());

export const logoutAndClearSavedAuth = () => {
  clearSavedAuth();
  setAuthToken('');
};

export const setAuthTokenForAddress = (
  address: string,
  token: string,
  id: number
) => {
  const allData = getAllData();
  allData.data[address.toLowerCase()] = { token, id };
  allData.recent = address.toLowerCase();
  saveAllData(allData);
  setAuthToken(token);
};

export const reloadAuthFromCookie = () => {
  const allData = getAllData();
  const { recent, data } = allData;
  if (recent) {
    const auth = data[recent] ?? {};
    setAuthToken(auth.token);
    return { address: recent, ...auth };
  }
};
export const getAllData = (): IAuth => {
  try {
    const stored = Cookies.get(AUTH_COOKIE);
    if (!stored) return emptyData();
    return JSON.parse(stored);
  } catch {
    return emptyData();
  }
};
