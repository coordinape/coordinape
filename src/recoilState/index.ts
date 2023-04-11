import { atom, useRecoilValue } from 'recoil';

export * from './app';
export * from './db';

// Use this like a semaphore, add and subtract.
export const rGlobalLoading = atom({
  key: 'rGlobalLoading',
  default: 0,
});

// This toggles team only features
export const rDevMode = atom({
  key: 'rDevMode',
  default: false,
});

export const useDevMode = () => useRecoilValue(rDevMode);
