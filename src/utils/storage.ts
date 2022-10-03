import { assertDef } from 'utils/tools';

import { IAuth } from 'types';

const STORAGE_AUTH = 'capeAuth';

export default {
  setAuth: (auth: IAuth) =>
    localStorage.setItem(STORAGE_AUTH, JSON.stringify(auth)),
  getAuth: (): IAuth => {
    try {
      return JSON.parse(assertDef(localStorage.getItem(STORAGE_AUTH)));
    } catch {
      return {
        authTokens: {},
      };
    }
  },
};
