import { ConnectorNames } from './enums';

const STORAGE_KEY_FORCE_OPT_OUT_CIRCLE_ID_ITEM = 'forceOptOutCircleId';
const STORAGE_KEY_CIRCLE_ID = 'circleId';
const STORAGE_KEY_WALLET_ADDRESS = 'walletAddress';
const STORAGE_KEY_CONNECTOR = 'connector';

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

  setAddress: (address: string) =>
    localStorage.setItem(STORAGE_KEY_WALLET_ADDRESS, address),
  getAddress: () =>
    localStorage.getItem(STORAGE_KEY_WALLET_ADDRESS) ?? undefined,
  clearAddress: () => localStorage.removeItem(STORAGE_KEY_WALLET_ADDRESS),

  setConnectorName: (connector: ConnectorNames) =>
    localStorage.setItem(STORAGE_KEY_CONNECTOR, connector),
  getConnectorName: () =>
    (localStorage.getItem(STORAGE_KEY_CONNECTOR) as ConnectorNames) ??
    undefined,
  clearConnectorName: () => localStorage.removeItem(STORAGE_KEY_CONNECTOR),

  setHasSeenForceOptOutPopup: (userId: number) =>
    localStorage.setItem(getHasSeenForceOptOutPopupKey(userId), 'true'),
  hasSeenForceOptOutPopup: (userId: number) =>
    !!localStorage.getItem(getHasSeenForceOptOutPopupKey(userId)),
  unsetHasSeenForceOptOutPopup: (userId: number) =>
    localStorage.removeItem(getHasSeenForceOptOutPopupKey(userId)),
};
