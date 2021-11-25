import { assertDef } from 'utils/tools';

import { IAuth } from 'types';

const STORAGE_KEY_FORCE_OPT_OUT_CIRCLE_ID_ITEM = 'capeForceOptOutCircleId';
const STORAGE_KEY_CIRCLE_ID = 'capeCircleId';
const STORAGE_AUTH = 'capeAuth';

const getHasSeenForceOptOutPopupKey = (userId: number) =>
  `${STORAGE_KEY_FORCE_OPT_OUT_CIRCLE_ID_ITEM}+${userId}`;

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

  setHasSeenForceOptOutPopup: (userId: number) =>
    localStorage.setItem(getHasSeenForceOptOutPopupKey(userId), 'true'),
  hasSeenForceOptOutPopup: (userId: number) =>
    !!localStorage.getItem(getHasSeenForceOptOutPopupKey(userId)),
  unsetHasSeenForceOptOutPopup: (userId: number) =>
    localStorage.removeItem(getHasSeenForceOptOutPopupKey(userId)),
};
