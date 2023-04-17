// at 5k elements for filter-map-slice itiriri is more performant

import debug from 'debug';
import { atom, selector, selectorFamily, useRecoilValue } from 'recoil';

import { extraProfile } from 'utils/modelExtenders';
import { neverEndingPromise } from 'utils/recoil';

import { rManifest } from './db';
import { queryProfile } from './queries';

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

const rProfile = selectorFamily({
  key: 'rProfile',
  get: (address: string) => async () => {
    const profile = await queryProfile(address);
    return extraProfile(profile);
  },
});

// DEPRECATED
export const useMyProfile = () => useRecoilValue(rManifest).myProfile;

// DEPRECATED
export const useProfile = (address: string) =>
  useRecoilValue(rProfile(address));
