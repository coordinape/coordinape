import { atom, selector, useRecoilValue } from 'recoil';

import {
  extraEpoch,
  extraCircle,
  extraUser,
  extraProfile,
} from 'utils/modelExtenders';
import { neverEndingPromise } from 'utils/recoil';

import { IApiManifest, IManifest, IMyProfile } from 'types';

// Use this like a semaphore, add and subtract.
// FIXME replace with zustand
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

export const rApiManifest = atom<IApiManifest | undefined>({
  key: 'rApiManifest',
  default: undefined,
});

export const rManifest = selector<IManifest>({
  key: 'rManifest',
  get: async ({ get }) => {
    const manifest = get(rApiManifest);
    if (manifest === undefined) {
      return neverEndingPromise<IManifest>();
    }

    const circles = manifest.circles.map(c => extraCircle(c));
    const epochs = manifest.active_epochs.map(e => extraEpoch(e));
    // TODO: @exrhizo I regret asking Zashton to call this myUsers rather
    // than same as all other profiles.
    const myUsers = manifest.myUsers.map(u => ({
      ...extraUser(u),
      circle: circles.find(c => c.id === u.circle_id),
      teammates: u.teammates ?? [],
    }));
    const myProfile = {
      ...extraProfile(manifest.profile),
      myUsers,
      users: myUsers,
    } as IMyProfile;

    return {
      myProfile,
      circles,
      epochs,
    };
  },
});

// DEPRECATED
export const useMyProfile = () => useRecoilValue(rManifest).myProfile;
