import assert from 'assert';

import { IAuth } from 'types';

const STORAGE_AUTH = 'capeAuth';

export default {
  setAuth: (auth: IAuth) =>
    localStorage.setItem(STORAGE_AUTH, JSON.stringify(auth)),
  getAuth: (): IAuth => {
    try {
      const auth = localStorage.getItem(STORAGE_AUTH);
      assert(auth);
      return JSON.parse(auth);
    } catch {
      return {
        authTokens: {},
      };
    }
  },
};
