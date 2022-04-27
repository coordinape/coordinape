import { atom, useRecoilValue, useSetRecoilState } from 'recoil';

export const rWalletModalOpen = atom({
  key: 'rWalletModalOpen',
  default: false,
});

// Use this like a semaphore, add and subtract.
export const rGlobalLoading = atom({
  key: 'rGlobalLoading',
  default: 0,
});

export const rGlobalLoadingText = atom({
  key: 'rGlobalLoadingText',
  default: '',
});

export const rEditProfileOpen = atom({
  key: 'rEditProfileOpen',
  default: false,
});

// This toggles team only features
export const rDevMode = atom({
  key: 'rDevMode',
  default: false,
});

export const useDevMode = () => useRecoilValue(rDevMode);
export const useSetEditProfileOpen = () => useSetRecoilState(rEditProfileOpen);
export const useSetWalletModalOpen = () => useSetRecoilState(rWalletModalOpen);
