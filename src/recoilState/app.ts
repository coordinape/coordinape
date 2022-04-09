// at 5k elements for filter-map-slice itiriri is more performant
import iti from 'itiriri';
import * as mutations from 'lib/gql/mutations';
import * as queries from 'lib/gql/queries';
import { DateTime } from 'luxon';
import {
  atom,
  selector,
  selectorFamily,
  useRecoilValue,
  RecoilValueReadOnly,
  useRecoilValueLoadable,
} from 'recoil';

import { getApiService } from 'services/api';
import { extraProfile } from 'utils/modelExtenders';
import { getSelfIdProfile } from 'utils/selfIdHelpers';
import storage from 'utils/storage';
import { neverEndingPromise } from 'utils/tools';

import { rManifest, rFullCircle } from './db';

import {
  IUser,
  IMyUser,
  IEpoch,
  ICircle,
  INominee,
  IProfile,
  IAuth,
} from 'types';

export const rWalletAuth = atom({
  key: 'rWalletAuth',
  default: selector({
    key: 'rWalletAuth/default',
    get: () => {
      const auth = storage.getAuth();
      updateApiService(auth);
      return auth;
    },
  }),
  effects_UNSTABLE: [
    ({ onSet }) => {
      onSet(auth => {
        updateApiService(auth);
        storage.setAuth(auth);
      });
    },
  ],
});

const updateApiService = ({ address, authTokens }: IAuth) => {
  const token = address && authTokens[address];
  // eslint-disable-next-line no-console
  const api = getApiService();
  if (!token && api.token) mutations.logout();
  api.setAuth(token);
};

export const rSelectedCircleIdSource = atom({
  key: 'rSelectedCircleIdSource',
  default: storage.getCircleId(),
  effects_UNSTABLE: [
    ({ onSet }) => {
      onSet(newId => {
        if (newId === undefined) {
          storage.clearCircleId();
        } else {
          storage.setCircleId(newId as number);
        }
      });
    },
  ],
});

// Suspend unless it has a value.
export const rSelectedCircleId = selector({
  key: 'rSelectedCircleId',
  get: async ({ get }) => {
    const id = get(rSelectedCircleIdSource);
    return id === undefined ? neverEndingPromise<number>() : id;
  },
});

/*
 *
 * Base DB Selectors
 *
 * TODO: These could just as well be replaced with direct references to
 * rManifest and rFullCircle
 ***************/

export const rMyProfile = selector({
  key: 'rMyProfile',
  get: async ({ get }) => get(rManifest).myProfile,
});

export const rCirclesMap = selector({
  key: 'rCirclesMap',
  get: async ({ get }) => iti(get(rManifest).circles).toMap(c => c.id),
});

export const rEpochsMap = selector({
  key: 'rEpochsMap',
  get: async ({ get }) => {
    const result = iti(get(rManifest).epochs).toMap(e => e.id);
    iti(get(rFullCircle).epochsMap.values()).forEach(e => result.set(e.id, e));
    return result;
  },
});

export const rNomineesMap = selector({
  key: 'rNomineesMap',
  get: async ({ get }) => get(rFullCircle).nomineesMap,
});

export const rUsersMap = selector({
  key: 'rUsersMap',
  get: async ({ get }) => {
    const result = iti(
      get(rManifest).myProfile.myUsers as unknown as IUser[]
    ).toMap(u => u.id);
    iti(get(rFullCircle).usersMap.values()).forEach(u => result.set(u.id, u));
    return result;
  },
});

export const rPastGiftsMap = selector({
  key: 'rPastGiftsMap',
  get: async ({ get }) => get(rFullCircle).pastGiftsMap,
});

export const rPendingGiftsMap = selector({
  key: 'rPendingGiftsMap',
  get: async ({ get }) => get(rFullCircle).pendingGiftsMap,
});

export const rGiftsMap = selector({
  key: 'rGiftsMap',
  get: async ({ get }) => get(rFullCircle).giftsMap,
});

export const rProfile = selectorFamily({
  key: 'rProfile',
  get: (address: string) => async () => {
    const [profile, selfIdProfile] = await Promise.all([
      queries.getProfile(address),
      getSelfIdProfile(address),
    ]);

    return {
      ...selfIdProfile,
      ...extraProfile(profile),
    } as IProfile;
  },
});

/*
 *
 * Joining Base State Selectors
 *
 ***************/
export const rCircles = selector({
  key: 'rCircles',
  get: ({ get }) => {
    const circleMap = get(rCirclesMap);
    const allCircles = Array.from(circleMap.values());
    const myCircles = iti(get(rMyProfile).myUsers)
      .map(u => circleMap.get(u.circle_id))
      .filter(c => c !== undefined)
      .toArray() as unknown as ICircle[]; // Brittle
    const myCirclesSet = new Set(myCircles.map(c => c.id));
    const viewOnlyCircles = allCircles.filter(c => !myCirclesSet.has(c.id));

    return {
      myCircles,
      allCircles,
      viewOnlyCircles,
    };
  },
});

export const rCircle = selectorFamily<ICircleState, number | undefined>({
  key: 'rCircle',
  get:
    circleId =>
    ({ get }) => {
      if (!circleId) return neverEndingPromise();
      const circle = get(rCirclesMap).get(circleId);
      const hasAdminView = get(rHasAdminView);
      const users = iti(get(rUsersMap).values()).toArray();
      const getCircleUsers = () =>
        iti(users)
          .filter(u => u.circle_id === circleId)
          .filter(u => !u.deleted_at);

      const myProfile = get(rMyProfile);

      const myUser = myProfile.myUsers.find(u => u.circle_id === circleId);

      const circleEpochsStatus = get(rCircleEpochsStatus(circleId));
      const activeNominees = iti(get(rNomineesMap).values())
        .filter(n => n.circle_id === circleId)
        .filter(n => !n.ended && !n.expired && n.vouchesNeeded > 0)
        .sort(({ expiryDate: a }, { expiryDate: b }) => a.diff(b).milliseconds)
        .toArray();

      const firstUser = getCircleUsers().first();

      const impersonate = !myUser && hasAdminView;
      const meOrPretend = myUser
        ? { ...myUser, profile: myProfile }
        : impersonate
        ? ({
            ...firstUser,
            circle: circle,
            teammates: getCircleUsers()
              .filter(u => u.id !== firstUser?.id)
              .toArray(),
          } as IMyUser)
        : undefined;

      if (meOrPretend === undefined || circle === undefined) {
        return neverEndingPromise();
      }

      return {
        circleId,
        circle,
        myUser: meOrPretend,
        impersonate,
        users: getCircleUsers().toArray(),
        usersNotMe: getCircleUsers()
          .filter(u => u.id !== meOrPretend?.id)
          .toArray(),
        usersWithDeleted: iti(users)
          .filter(u => u.circle_id === circleId)
          .toArray(),
        circleEpochsStatus,
        activeNominees,
      };
    },
});

export const rSelectedCircle = selector({
  key: 'rSelectedCircle',
  get: ({ get }) => get(rCircle(get(rSelectedCircleId))),
});

export const rHasAdminView = selector({
  key: 'rHasAdminView',
  get: ({ get }) => !!get(rMyProfile)?.admin_view,
});

export const rCircleEpochs = selectorFamily<IEpoch[], number>({
  key: 'rCircleEpochs',
  get:
    (circleId: number) =>
    ({ get }) => {
      let lastNumber = 1;
      const epochsWithNumber = [] as IEpoch[];
      iti(get(rEpochsMap).values())
        .filter(e => e.circle_id === circleId)
        .sort((a, b) => +new Date(a.start_date) - +new Date(b.start_date))
        .forEach(epoch => {
          lastNumber = epoch.number ?? lastNumber + 1;
          epochsWithNumber.push({ ...epoch, number: lastNumber });
        });

      return epochsWithNumber;
    },
});

export const rCircleEpochsStatus = selectorFamily({
  key: 'rCircleEpochsStatus',
  get:
    (circleId: number) =>
    ({ get }) => {
      const epochs = get(rCircleEpochs(circleId));
      const pastEpochs = epochs.filter(
        epoch => +new Date(epoch.end_date) - +new Date() <= 0
      );
      const futureEpochs = epochs.filter(
        epoch => +new Date(epoch.start_date) - +new Date() >= 0
      );
      const previousEpoch =
        pastEpochs.length > 0 ? pastEpochs[pastEpochs.length - 1] : undefined;
      const nextEpoch = futureEpochs.length > 0 ? futureEpochs[0] : undefined;
      const previousEpochEndedOn =
        previousEpoch &&
        previousEpoch.endDate
          .minus({ seconds: 1 })
          .toLocal()
          .toLocaleString(DateTime.DATE_MED);

      const currentEpoch = epochs.find(
        epoch =>
          +new Date(epoch.start_date) - +new Date() <= 0 &&
          +new Date(epoch.end_date) - +new Date() >= 0
      );

      const closest = currentEpoch ?? nextEpoch;
      const currentEpochNumber = currentEpoch?.number
        ? String(currentEpoch.number)
        : previousEpoch?.number
        ? String(previousEpoch.number + 1)
        : '1';
      let timingMessage = 'Epoch not Scheduled';
      let longTimingMessage = 'Next Epoch not Scheduled';

      if (closest && !closest.started) {
        timingMessage = `Epoch Begins in ${closest.labelUntilStart}`;
        longTimingMessage = `Epoch ${currentEpochNumber} Begins in ${closest.labelUntilStart}`;
      }
      if (closest && closest.started) {
        timingMessage = `Epoch ends in ${closest.labelUntilEnd}`;
        longTimingMessage = `Epoch ${currentEpochNumber} Ends in ${closest.labelUntilEnd}`;
      }

      return {
        epochs,
        pastEpochs,
        previousEpoch,
        currentEpoch,
        nextEpoch,
        futureEpochs,
        previousEpochEndedOn,
        epochIsActive: !!currentEpoch,
        timingMessage,
        longTimingMessage,
      };
    },
});

export const rCircleNominees = selectorFamily({
  key: 'rCircleNominees',
  get:
    (circleId: number) =>
    ({ get }) =>
      iti(get(rNomineesMap).values())
        .filter(n => n.circle_id === circleId)
        .sort(({ expiryDate: a }, { expiryDate: b }) => a.diff(b).milliseconds)
        .toArray(),
});

type ExtractRecoilType<P> = P extends (a: any) => RecoilValueReadOnly<infer T>
  ? T
  : never;

export interface ICircleState {
  circleId: number;
  circle: ICircle;
  myUser: IMyUser;
  impersonate: boolean;
  users: IUser[];
  usersNotMe: IUser[];
  usersWithDeleted: IUser[];
  circleEpochsStatus: ExtractRecoilType<typeof rCircleEpochsStatus>;
  activeNominees: INominee[];
}

export const useHasSelectedCircle = () =>
  useRecoilValueLoadable(rSelectedCircleId).valueMaybe() !== undefined;
export const useCircles = () => useRecoilValue(rCircles);
export const useMyProfile = () => useRecoilValue(rMyProfile);
export const useWalletAuth = () => useRecoilValue(rWalletAuth);
export const useSelectedCircleId = () => useRecoilValue(rSelectedCircleId);
export const useCircle = (id: number | undefined) =>
  useRecoilValue(rCircle(id));

export const useSelectedCircle = () =>
  useRecoilValue(rCircle(useSelectedCircleId()));

export const useMyProfileLoadable = () => useRecoilValueLoadable(rMyProfile);
export const useAuthToken = () => {
  const { authTokens, address } =
    useRecoilValueLoadable(rWalletAuth).valueMaybe() ?? {};
  return address && authTokens?.[address];
};

export const useSelectedCircleLoadable = () =>
  useRecoilValueLoadable(rCircle(useSelectedCircleId()));

export const useSelectedCircleEpochsStatus = () =>
  useEpochsStatus(useSelectedCircleId());

export const useProfile = (address: string) =>
  useRecoilValue(rProfile(address));

export const useEpochsStatus = (circleId: number) =>
  useRecoilValue(rCircleEpochsStatus(circleId));
