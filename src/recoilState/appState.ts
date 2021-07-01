import moment from 'moment';
import { atom, atomFamily, selector, selectorFamily } from 'recoil';

import { getApiService } from 'services/api';
import storage from 'utils/storage';
import { calculateEpochTimings } from 'utils/tools';

import {
  IUser,
  IEpoch,
  ICircle,
  IRecoilGetParams,
  IProfile,
  ITokenGift,
  IEpochTimings,
  IUserGift,
} from 'types';

export const rMyAddress = atom<string>({
  key: 'rMyAddress',
  default: '',
});

export const rMyProfileStaleSignal = atom<number>({
  key: 'rMyProfileStaleSignal',
  default: 0,
});

export const rMyProfile = selector<IProfile | undefined>({
  key: 'rMyProfile',
  get: async ({ get }: IRecoilGetParams) => {
    get(rMyProfileStaleSignal);
    const myAddress = get(rMyAddress);
    return myAddress ? await getApiService().getProfile(myAddress) : undefined;
  },
});

export const rMyUsers = selector<IUser[]>({
  key: 'rMyUsers',
  get: ({ get }: IRecoilGetParams) => {
    const profile = get(rMyProfile);
    return profile?.users ?? [];
  },
});

export const rMyCircleUser = selectorFamily<IUser | undefined, number>({
  key: 'rMyCircleUser',
  get: (circleId: number) => ({ get }: IRecoilGetParams) =>
    get(rMyUsers).find((u) => u.circle_id === circleId),
});

export const rSelectedCircleId = atom<number>({
  key: 'rSelectedCircleId',
  default: -1,
  effects_UNSTABLE: [
    ({ onSet }) => {
      onSet((newId) => {
        storage.setCircleId(newId as number);
      });
    },
  ],
});

export const rSelectedMyUser = selector<IUser | undefined>({
  key: 'rSelectedMyUser',
  get: async ({ get }: IRecoilGetParams) => {
    const selectedCircleId = get(rSelectedCircleId);
    return get(rMyUsers).find((u) => u.circle_id === selectedCircleId);
  },
});

export const rMyCircles = selector<ICircle[]>({
  key: 'rMyCircles',
  get: ({ get }: IRecoilGetParams) => {
    const myUsers = get(rMyUsers);
    return myUsers
      .map((u) => u.circle)
      .filter((c) => c !== undefined) as ICircle[];
  },
});

export const rFetchedAt = atomFamily<Map<string, number>, string>({
  key: 'rFetchedAt',
  default: new Map(),
});

export const rProfileMap = atom<Map<string, IProfile>>({
  key: 'rProfileMap',
  default: new Map(),
});

export const rCirclesMap = atom<Map<number, ICircle>>({
  key: 'rCirclesMap',
  default: new Promise((resolve) => {
    getApiService()
      .getCircles()
      .then((circles) => resolve(new Map(circles.map((c) => [c.id, c]))));
  }),
});

export const rCircles = selector<ICircle[]>({
  key: 'rCircles',
  get: ({ get }: IRecoilGetParams) => Array.from(get(rCirclesMap).values()),
});

export const rEpochsMap = atom<Map<number, IEpoch>>({
  key: 'rEpochsMap',
  default: new Promise((resolve) => {
    getApiService()
      .getFutureEpochs()
      .then((epochs) => resolve(new Map(epochs.map((e) => [e.id, e]))));
  }),
});

export const rEpochs = selector<IEpoch[]>({
  key: 'rEpochs',
  get: ({ get }: IRecoilGetParams) => Array.from(get(rEpochsMap).values()),
});

export const rUsersMap = atom<Map<number, IUser>>({
  key: 'rUsersMap',
  default: new Map(),
});

export const rUsers = selector<IUser[]>({
  key: 'rUsers',
  get: ({ get }: IRecoilGetParams) => Array.from(get(rUsersMap).values()),
});

export const rGiftsMap = atom<Map<number, ITokenGift>>({
  key: 'rGiftsMap',
  default: new Map(),
});

export const rGifts = selector<ITokenGift[]>({
  key: 'rGifts',
  get: ({ get }: IRecoilGetParams) => Array.from(get(rGiftsMap).values()),
});

export const rPendingGiftsMap = atom<Map<number, ITokenGift>>({
  key: 'rPendingGiftsMap',
  default: new Map(),
});

export const rPendingGifts = selector<ITokenGift[]>({
  key: 'rPendingGifts',
  get: ({ get }: IRecoilGetParams) =>
    Array.from(get(rPendingGiftsMap).values()),
});

export const rPendingGiftsFor = selectorFamily<ITokenGift[], number>({
  key: 'rPendingGiftsFor',
  get: (userId: number) => ({ get }: IRecoilGetParams) => {
    const pendingGifts = get(rPendingGifts);
    return pendingGifts.filter((g) => g.recipient_id === userId);
  },
});

export const rCircleEpochs = selectorFamily<IEpoch[], number>({
  key: 'rCircleEpochs',
  get: (circleId: number) => ({ get }: IRecoilGetParams) => {
    let epochs = Array.from(get(rEpochsMap).values());
    epochs = epochs.filter((e) => e.circle_id === circleId);
    epochs = epochs.sort(
      (a, b) => +new Date(a.start_date) - +new Date(b.start_date)
    );
    return epochs;
  },
});

export const rCircleEpochsStatus = selectorFamily<
  {
    pastEpochs: IEpoch[];
    previousEpoch?: IEpoch;
    currentEpoch?: IEpoch;
    nextEpoch?: IEpoch;
    futureEpochs: IEpoch[];
    previousEpochEndedOn?: string;
  },
  number
>({
  key: 'rCircleEpochsStatus',
  get: (circleId: number) => ({ get }: IRecoilGetParams) => {
    const epochs = get(rCircleEpochs(circleId));
    const pastEpochs = epochs.filter(
      (epoch) => +new Date(epoch.end_date) - +new Date() <= 0
    );
    const futureEpochs = epochs.filter(
      (epoch) => +new Date(epoch.start_date) - +new Date() >= 0
    );
    const previousEpoch =
      pastEpochs.length > 0 ? pastEpochs[pastEpochs.length - 1] : undefined;
    const nextEpoch = futureEpochs.length > 0 ? futureEpochs[0] : undefined;
    const previousEpochEndedOn = previousEpoch
      ? moment
          .utc(previousEpoch.end_date)
          .subtract(1, 'seconds')
          .local()
          .format('dddd MMMM Do')
      : undefined;
    const currentEpoch = epochs.find(
      (epoch) =>
        +new Date(epoch.start_date) - +new Date() <= 0 &&
        +new Date(epoch.end_date) - +new Date() >= 0
    );
    return {
      pastEpochs,
      previousEpoch,
      currentEpoch,
      nextEpoch,
      futureEpochs,
      previousEpochEndedOn,
    };
  },
});

export const rCircleEpochTiming = selectorFamily<IEpochTimings, number>({
  key: 'rCircleEpochTiming',
  get: (circleId: number) => ({ get }: IRecoilGetParams) => {
    const { previousEpoch, currentEpoch, nextEpoch } = get(
      rCircleEpochsStatus(circleId)
    );
    return {
      previousEpochTiming: previousEpoch
        ? calculateEpochTimings(previousEpoch)
        : undefined,
      currentEpochTiming: currentEpoch
        ? calculateEpochTimings(currentEpoch)
        : undefined,
      nextEpochTiming: nextEpoch ? calculateEpochTimings(nextEpoch) : undefined,
    };
  },
});

export const rSelectedCircle = selector<ICircle | undefined>({
  key: 'rSelectedCircle',
  get: async ({ get }: IRecoilGetParams) => {
    const selectedCircleId = get(rSelectedCircleId);
    const circlesMap = get(rCirclesMap);
    return circlesMap.get(selectedCircleId);
  },
});

export const rAvailableTeammates = selector<IUser[]>({
  key: 'rAvailableTeammates',
  get: ({ get }: IRecoilGetParams) => {
    const selectedCircleId = get(rSelectedCircleId);
    const selectedMyUser = get(rSelectedMyUser);
    const usersMap = get(rUsersMap);
    return Array.from(usersMap.values()).filter(
      (u) =>
        !u.deleted_at &&
        !u.is_hidden &&
        u.id !== selectedMyUser?.id &&
        u.circle_id === selectedCircleId
    );
  },
});

export const rSelectedCircleUsers = selector<IUser[]>({
  key: 'rSelectedCircleUsers',
  get: ({ get }: IRecoilGetParams) => {
    const selectedCircleId = get(rSelectedCircleId);
    const usersMap = get(rUsersMap);
    return Array.from(usersMap.values()).filter(
      (u) => u.circle_id === selectedCircleId
    );
  },
});

export const rMyUserGifts = selectorFamily<IUserGift[], number>({
  key: 'rMyUserGifts',
  get: (epochId: number) => ({ get }: IRecoilGetParams) => {
    const epoch = get(rEpochsMap).get(epochId);
    const myUser = get(rMyUsers).find((u) => u.circle_id === epoch?.circle_id);
    const usersMap = get(rUsersMap);
    const myUserGifts = get(rGifts).filter(
      (g) => myUser && g.recipient_id === myUser.id && g.epoch_id === epochId
    );
    return myUserGifts.map(
      (g) =>
        ({
          user: usersMap.get(g.sender_id),
          gift: g,
        } as IUserGift)
    );
  },
});
