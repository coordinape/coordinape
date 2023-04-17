// at 5k elements for filter-map-slice itiriri is more performant

import debug from 'debug';
import { atom, selector, useRecoilValue } from 'recoil';

import { neverEndingPromise } from 'utils/recoil';

import { rManifest } from './db';

const log = debug('recoil');

export const rSelectedCircleIdSource = atom<number | undefined>({
  key: 'rSelectedCircleIdSource',
  default: undefined,
});

// Suspend unless it has a value.
// This is set by fetchCircle in hooks/legacyApi
export const rSelectedCircleId = selector({
  key: 'rSelectedCircleId',
  get: async ({ get }) => {
    const id = get(rSelectedCircleIdSource);
    if (id === undefined) {
      log('rSelectedCircleId: neverEndingPromise...');
      return neverEndingPromise<number>();
    }
    return id;
  },
});

// DEPRECATED
export const useMyProfile = () => useRecoilValue(rManifest).myProfile;
