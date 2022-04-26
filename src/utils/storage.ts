import { assertDef } from 'utils/tools';

import { IAuth } from 'types';

const STORAGE_KEY_CIRCLE_ID = 'capeCircleId';
const STORAGE_AUTH = 'capeAuth';

export default {
  setCircleId: (id: number) =>
    localStorage.setItem(STORAGE_KEY_CIRCLE_ID, String(id)),
  getCircleId: () => {
    try {
      const id = localStorage.getItem(STORAGE_KEY_CIRCLE_ID);
      return id !== null ? Number(id) : undefined;
    } catch {
      return undefined;
    }
  },
  clearCircleId: () => localStorage.removeItem(STORAGE_KEY_CIRCLE_ID),

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
  clearAuth: () => localStorage.removeItem(STORAGE_AUTH),
};
