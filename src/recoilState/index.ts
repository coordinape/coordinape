import { atom, selector, useRecoilValue } from 'recoil';

import { extraCircle, extraUser, extraProfile } from 'utils/modelExtenders';
import { neverEndingPromise } from 'utils/recoil';

import type {
  IApiProfile,
  IApiUser,
  IApiCircle,
  ICircle,
  IMyProfile,
} from 'types';

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

export interface IApiManifest {
  profile: IApiProfile;
  myUsers: IApiUser[]; // myUsers
  circles: IApiCircle[];
}

export const rApiManifest = atom<IApiManifest | undefined>({
  key: 'rApiManifest',
  default: undefined,
});

export interface IManifest {
  myProfile: IMyProfile;
  circles: ICircle[];
}

export const rManifest = selector<IManifest>({
  key: 'rManifest',
  get: async ({ get }) => {
    const manifest = get(rApiManifest);
    if (manifest === undefined) {
      return neverEndingPromise<IManifest>();
    }

    const circles = manifest.circles.map(c => extraCircle(c));
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
    };
  },
});

// DEPRECATED
export const useMyProfile = () => useRecoilValue(rManifest).myProfile;
