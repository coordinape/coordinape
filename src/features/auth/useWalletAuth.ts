import { client } from 'lib/gql/client';
import { atom, selector, useRecoilValue } from 'recoil';

import { getApiService } from 'services/api';
import storage from 'utils/storage';

import { IAuth } from 'types';

const logout = async (): Promise<boolean> => {
  const { logoutUser } = await client.mutate(
    { logoutUser: { id: true } },
    { operationName: 'logout' }
  );
  return !!logoutUser?.id;
};

const updateApiService = ({ address, authTokens }: IAuth) => {
  const token = address && authTokens[address];
  const api = getApiService();
  if (!token && api.token) logout();
  api.setAuth(token);
};

export const rWalletAuth = atom({
  key: 'rWalletAuth',
  default: selector({
    key: 'rWalletAuth/default',
    get: () => {
      const auth = storage.getAuth();
      updateApiService(auth);
      return auth;
    },
  }),
  effects_UNSTABLE: [
    ({ onSet }) => {
      onSet(auth => {
        updateApiService(auth);
        storage.setAuth(auth);
      });
    },
  ],
});

export const useWalletAuth = () => useRecoilValue(rWalletAuth);
