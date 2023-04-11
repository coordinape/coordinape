import iti from 'itiriri';
import { atom, selector } from 'recoil';

import {
  extraEpoch,
  extraCircle,
  extraGift,
  extraUser,
  extraProfile,
} from 'utils/modelExtenders';
import { neverEndingPromise } from 'utils/recoil';

import {
  IApiFullCircle,
  IApiManifest,
  IUser,
  IFullCircle,
  IManifest,
  IMyProfile,
} from 'types';

export const rApiManifest = atom<IApiManifest | undefined>({
  key: 'rApiManifest',
  default: undefined,
});

export const rApiFullCircle = atom({
  key: 'rApiFullCircle',
  default: new Map<number, IApiFullCircle>(),
});

/*
 *
 * Base DB Selectors
 *
 ***************/
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

export const rFullCircle = selector<IFullCircle>({
  key: 'rFullCircle',
  get: async ({ get }) => {
    const fullCircle = get(rApiFullCircle);
    if (fullCircle === undefined) {
      return neverEndingPromise<IFullCircle>();
    }

    const users = iti(fullCircle.values())
      .flat(fc =>
        fc.users.map(
          ({ profile, ...u }) => ({ profile, ...extraUser(u) } as IUser)
        )
      )
      .toArray();
    const userMap = iti(users).toMap(u => u.id);

    const pending = iti(
      iti(fullCircle.values())
        .flat(fc => fc.pending_gifts)
        .toArray()
    );
    const pastGifts = iti(
      iti(fullCircle.values())
        .flat(fc => fc.token_gifts.map(g => extraGift(g, userMap, false)))
        .toArray()
    );
    const allGifts = pending
      .map(g => extraGift({ ...g, id: g.id + 1000000000 }, userMap, true))
      .concat(pastGifts);
    const epochs = iti(fullCircle.values()).flat(fc =>
      fc.epochs.map(e => extraEpoch(e))
    );

    return {
      usersMap: iti(users).toMap(u => u.id),
      pendingGiftsMap: pending
        .map(g => extraGift(g, userMap, true))
        .toMap(g => g.id),
      pastGiftsMap: pastGifts.toMap(g => g.id),
      giftsMap: allGifts.toMap(g => g.id),
      epochsMap: epochs.toMap(e => e.id),
    };
  },
});
