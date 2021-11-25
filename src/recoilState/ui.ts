import { atom, useRecoilState, useSetRecoilState } from 'recoil';

export const rWalletModalOpen = atom({
  key: 'rWalletModalOpen',
  default: false,
});
export const rCircleSelectorOpen = atom({
  key: 'rCircleSelectorOpen',
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
export const rTriggerMode = atom({
  key: 'rTriggerMode',
  default: false,
});

export const useTriggerMode = () => useRecoilState(rTriggerMode);
export const useSetEditProfileOpen = () => useSetRecoilState(rEditProfileOpen);
export const useSetWalletModalOpen = () => useSetRecoilState(rWalletModalOpen);
export const useSetCircleSelectorOpen = () =>
  useSetRecoilState(rCircleSelectorOpen);
