import { client } from 'lib/gql/client';
import { atom, selector, useRecoilValue } from 'recoil';

import storage from 'utils/storage';

import { getAuthToken, setAuthToken } from './token';

import { IAuth } from 'types';

const logout = async (): Promise<boolean> => {
  const { logoutUser } = await client.mutate(
    { logoutUser: { id: true } },
    { operationName: 'logout' }
  );
  return !!logoutUser?.id;
};

const updateToken = ({ address, authTokens }: IAuth) => {
  const token = address && authTokens[address];
  if (!token && getAuthToken(false)) logout();
  setAuthToken(token);
};

export const rWalletAuth = atom({
  key: 'rWalletAuth',
  default: selector({
    key: 'rWalletAuth/default',
    get: () => {
      const auth = storage.getAuth();
      updateToken(auth);
      return auth;
    },
  }),
  effects_UNSTABLE: [
    ({ onSet }) => {
      onSet(auth => {
        updateToken(auth);
        storage.setAuth(auth);
      });
    },
  ],
});

export const useWalletAuth = () => useRecoilValue(rWalletAuth);
