// at 5k elements for filter-map-slice itiriri is more performant
import iti from 'itiriri';
import moment from 'moment';
import {
  atom,
  atomFamily,
  selector,
  selectorFamily,
  useRecoilValue,
  useRecoilState,
  useSetRecoilState,
} from 'recoil';

import { getApiService } from 'services/api';
import {
  createCircleWithDefaults,
  createGiftWithUser,
  createExtendedEpoch,
} from 'utils/modelExtenders';
import storage from 'utils/storage';

import { rMyAddress } from './walletState';

import {
  IUser,
  IMyUsers,
  IApiFilledProfile,
  IApiProfile,
  IEpoch,
  ICircle,
  IRecoilGetParams,
  ITokenGift,
  IApiTokenGift,
  IApiEpoch,
} from 'types';

export const rSelectedCircleId = atom<number | undefined>({
  key: 'rSelectedCircleId',
  default: storage.getCircleId(),
  effects_UNSTABLE: [
    ({ onSet }) => {
      onSet((newId) => {
        if (newId === undefined) {
          storage.clearCircleId();
        } else {
          storage.setCircleId(newId as number);
        }
      });
    },
  ],
});
export const useSelectedCircleId = () => useRecoilValue(rSelectedCircleId);

// This toggles team only features
export const rTriggerMode = atom<boolean>({
  key: 'rTriggerMode',
  default: false,
});
export const useTriggerMode = () => useRecoilValue(rTriggerMode);
export const useStateTriggerMode = () => useRecoilState(rTriggerMode);
export const useSetTriggerMode = () => useSetRecoilState(rTriggerMode);

export const rInitialized = atom<boolean>({
  key: 'rInitialized',
  default: false,
});
export const useInitialized = () => useRecoilValue(rInitialized);
export const useStateInitialized = () => useRecoilState(rInitialized);
export const useSetInitialized = () => useSetRecoilState(rInitialized);

export const rMyProfileStaleSignal = atom<number>({
  key: 'rMyProfileStaleSignal',
  default: 0,
});

export const rMyProfile = selector<IApiFilledProfile | undefined>({
  key: 'rMyProfile',
  get: async ({ get }: IRecoilGetParams) => {
    get(rMyProfileStaleSignal);
    const myAddress = get(rMyAddress);
    return myAddress ? await getApiService().getProfile(myAddress) : undefined;
  },
});
export const useMyProfile = () => useRecoilValue(rMyProfile);

export const rHasAdminView = selector<boolean>({
  key: 'rHasAdminView',
  get: ({ get }: IRecoilGetParams) => {
    const profile = get(rMyProfile);
    if (!profile?.admin_view) {
      return false;
    }
    return true;
  },
});

export const rMyUsers = selector<IMyUsers[]>({
  key: 'rMyUsers',
  get: ({ get }: IRecoilGetParams) => {
    const profile = get(rMyProfile);
    if (!profile?.users) {
      return [];
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { users, ...userFillProfile } = profile;
    return (
      profile.users.map(
        (u) => ({ ...u, profile: userFillProfile as IApiProfile } as IMyUsers)
      ) ?? []
    );
  },
});

export const rMyCircleUser = selectorFamily<IMyUsers | undefined, number>({
  key: 'rMyCircleUser',
  get: (circleId: number) => ({ get }: IRecoilGetParams) =>
    get(rMyUsers).find((u) => u.circle_id === circleId),
});
export const useMyCircleUser = (circleId: number) =>
  useRecoilValue(rMyCircleUser(circleId));

export const rSelectedMyUser = selector<IMyUsers | undefined>({
  key: 'rSelectedMyUser',
  get: async ({ get }: IRecoilGetParams) => {
    const selectedCircleId = get(rSelectedCircleId);
    return selectedCircleId ? get(rMyCircleUser(selectedCircleId)) : undefined;
  },
});
export const useSelectedMyUser = () => useRecoilValue(rSelectedMyUser);

export const rMyCircles = selector<ICircle[]>({
  key: 'rMyCircles',
  get: ({ get }: IRecoilGetParams) => {
    const myProfile = get(rMyProfile);
    return (
      myProfile?.users?.map((u) => createCircleWithDefaults(u.circle)) ?? []
    );
  },
});

export const rFetchedAt = atomFamily<Map<string, number>, string>({
  key: 'rFetchedAt',
  default: new Map(),
});

export const rProfileRaw = atom<Map<string, IApiFilledProfile>>({
  key: 'rProfileRaw',
  default: new Map(),
});

export const rCirclesMap = atom<Map<number, ICircle>>({
  key: 'rCirclesMap',
  default: new Promise((resolve) => {
    getApiService()
      .getCircles()
      .then((circles) =>
        resolve(
          new Map(
            circles
              .map((c) => createCircleWithDefaults(c))
              .map((c) => [c.id, c])
          )
        )
      );
  }),
});

export const rCircles = selector<ICircle[]>({
  key: 'rCircles',
  get: ({ get }: IRecoilGetParams) => Array.from(get(rCirclesMap).values()),
});

export const rEpochsRaw = atom<Map<number, IApiEpoch>>({
  key: 'rEpochsRaw',
  default: new Promise((resolve) => {
    getApiService()
      .getFutureEpochs()
      .then((epochs) => resolve(new Map(epochs.map((e) => [e.id, e]))));
  }),
});

export const rEpochsMap = selector<Map<number, IEpoch>>({
  key: 'rEpochsMap',
  get: ({ get }: IRecoilGetParams) => {
    const giftsByEpoch = get(rGiftsByEpoch);
    return iti(get(rEpochsRaw).values())
      .map((e) => createExtendedEpoch(e, giftsByEpoch.get(e.id) ?? []))
      .toMap((e) => e.id);
  },
});

export const rEpochs = selector<IEpoch[]>({
  key: 'rEpochs',
  get: ({ get }: IRecoilGetParams) => Array.from(get(rEpochsMap).values()),
});

export const rUsersMap = atom<Map<number, IUser>>({
  key: 'rUsersMap',
  default: new Map(),
});
export const useUsersMap = () => useRecoilValue(rUsersMap);

export const rUsers = selector<IUser[]>({
  key: 'rUsers',
  get: ({ get }: IRecoilGetParams) => Array.from(get(rUsersMap).values()),
});

export const rPastGiftsRaw = atom<Map<number, IApiTokenGift>>({
  key: 'rPastGiftsRaw',
  default: new Map(),
});

export const rPastGiftsMap = selector<Map<number, ITokenGift>>({
  key: 'rPastGiftsMap',
  get: ({ get }: IRecoilGetParams) => {
    const userMap = get(rUsersMap);
    return iti(get(rPastGiftsRaw).values())
      .map((g) => createGiftWithUser(g, userMap))
      .toMap((g) => g.id);
  },
});

export const rPendingGiftsRaw = atom<Map<number, ITokenGift>>({
  key: 'rPendingGiftsRaw',
  default: new Map(),
});

export const rPendingGiftsMap = selector<Map<number, ITokenGift>>({
  key: 'rPendingGiftsMap',
  get: ({ get }: IRecoilGetParams) => {
    const userMap = get(rUsersMap);
    return iti(get(rPendingGiftsRaw).values())
      .map((g) => createGiftWithUser(g, userMap))
      .toMap((g) => g.id);
  },
});

export const rPendingGifts = selector<ITokenGift[]>({
  key: 'rPendingGifts',
  get: ({ get }: IRecoilGetParams) =>
    iti(get(rPendingGiftsMap).values())
      .sort(({ id: a }, { id: b }) => a - b)
      .toArray(),
});

export const rGiftsMap = selector<Map<number, ITokenGift>>({
  key: 'rGiftsMap',
  get: ({ get }: IRecoilGetParams) =>
    iti(get(rPendingGiftsMap).values())
      // TODO: ensure this can't happen
      // https://linear.app/yearn/issue/APE-220/research-ways-of-keeping-types-in-sync-better-between-server-and
      // This is crazy, but pending gifts are their own table - Bug city!
      .map((g) => ({ ...g, id: g.id + 100000 } as ITokenGift))
      .concat(get(rPastGiftsMap).values())
      .toMap((g) => g.id),
});

export const rGifts = selector<ITokenGift[]>({
  key: 'rGifts',
  get: ({ get }: IRecoilGetParams) =>
    Array.from(get(rGiftsMap).values()).sort(({ id: a }, { id: b }) => a - b),
});

export const rGiftsByEpoch = selector<Map<number, ITokenGift[]>>({
  key: 'rGiftsByEpoch',
  get: ({ get }: IRecoilGetParams) =>
    iti(get(rGifts)).toGroups((g) => g.epoch_id),
});

export const rPendingGiftsFor = selectorFamily<ITokenGift[], number>({
  key: 'rPendingGiftsFor',
  get: (userId: number) => ({ get }: IRecoilGetParams) => {
    const pendingGifts = get(rPendingGifts);
    return pendingGifts.filter((g) => g.recipient_id === userId);
  },
});

export const rPendingGiftsFrom = selectorFamily<ITokenGift[], number>({
  key: 'rPendingGiftsFrom',
  get: (userId: number) => ({ get }: IRecoilGetParams) => {
    const pendingGifts = get(rPendingGifts);
    return pendingGifts.filter((g) => g.sender_id === userId);
  },
});

export const rCircleEpochs = selectorFamily<IEpoch[], number>({
  key: 'rCircleEpochs',
  get: (circleId: number) => ({ get }: IRecoilGetParams) => {
    let lastNumber = 1;
    const epochsWithNumber = [] as IEpoch[];
    iti(get(rEpochsMap).values())
      .filter((e) => e.circle_id === circleId)
      .sort((a, b) => +new Date(a.start_date) - +new Date(b.start_date))
      .forEach((epoch) => {
        lastNumber = epoch.number ?? lastNumber + 1;
        epochsWithNumber.push({ ...epoch, number: lastNumber });
      });

    return epochsWithNumber;
  },
});
export const useCircleEpochs = (id: number) =>
  useRecoilValue(rCircleEpochs(id));
export const useSelectedCircleEpochs = () =>
  useRecoilValue(rCircleEpochs(useSelectedCircleId() ?? -1));

export const rCircleEpochsStatus = selectorFamily<
  {
    epochs: IEpoch[];
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
      epochs,
      pastEpochs,
      previousEpoch,
      currentEpoch,
      nextEpoch,
      futureEpochs,
      previousEpochEndedOn,
    };
  },
});
export const useCircleEpochsStatus = (id: number) =>
  useRecoilValue(rCircleEpochsStatus(id));
export const useSelectedCircleEpochsStatus = () =>
  useRecoilValue(rCircleEpochsStatus(useSelectedCircleId() ?? -1));

export const rSelectedCircle = selector<ICircle | undefined>({
  key: 'rSelectedCircle',
  get: async ({ get }: IRecoilGetParams) => {
    const selectedCircleId = get(rSelectedCircleId);
    const circlesMap = get(rCirclesMap);
    return circlesMap.get(selectedCircleId ?? -1);
  },
});
export const useSelectedCircle = () => useRecoilValue(rSelectedCircle);

export const rAvailableTeammates = selector<IUser[]>({
  key: 'rAvailableTeammates',
  get: ({ get }: IRecoilGetParams) => {
    const selectedCircleId = get(rSelectedCircleId);
    const selectedMyUser = get(rSelectedMyUser);
    const usersMap = get(rUsersMap);
    return iti(usersMap.values())
      .filter(
        (u) =>
          !u.deleted_at &&
          !u.is_hidden &&
          u.id !== selectedMyUser?.id &&
          u.circle_id === selectedCircleId
      )
      .toArray();
  },
});
export const useAvailableTeammates = () => useRecoilValue(rAvailableTeammates);

export const rSelectedCircleUsersWithDeleted = selector<IUser[]>({
  key: 'rSelectedCircleUsersWithDeleted',
  get: ({ get }: IRecoilGetParams) => {
    const selectedCircleId = get(rSelectedCircleId);
    const usersMap = get(rUsersMap);
    return iti(usersMap.values())
      .filter((u) => u.circle_id === selectedCircleId)
      .toArray();
  },
});
export const useSelectedCircleUsersWithDeleted = () =>
  useRecoilValue(rSelectedCircleUsersWithDeleted);

export const rSelectedCircleUsers = selector<IUser[]>({
  key: 'rSelectedCircleUsers',
  get: ({ get }: IRecoilGetParams) => {
    const selectedCircleId = get(rSelectedCircleId);
    return iti(get(rUsersMap).values())
      .filter((u) => !u.deleted_at && u.circle_id === selectedCircleId)
      .toArray();
  },
});
export const useSelectedCircleUsers = () =>
  useRecoilValue(rSelectedCircleUsers);

export const rGiftsFor = selectorFamily<ITokenGift[], number>({
  key: 'rGiftsFor',
  get: (userId: number) => ({ get }: IRecoilGetParams) =>
    get(rGifts).filter((g) => g.recipient_id === userId),
});
export const useGiftsFor = (userId: number) =>
  useRecoilValue(rGiftsFor(userId));

export const rGiftsFrom = selectorFamily<ITokenGift[], number>({
  key: 'rGiftsFrom',
  get: (userId: number) => ({ get }: IRecoilGetParams) =>
    get(rGifts).filter((g) => g.sender_id === userId),
});
export const useGiftsFrom = (userId: number) =>
  useRecoilValue(rGiftsFrom(userId));

export const rUserGifts = selectorFamily<
  {
    fromUser: ITokenGift[];
    forUser: ITokenGift[];
    fromUserByEpoch: Map<number, ITokenGift[]>;
    forUserByEpoch: Map<number, ITokenGift[]>;
    totalReceivedByEpoch: Map<number, number>;
  },
  number
>({
  key: 'rUserGifts',
  get: (userId: number) => ({ get }: IRecoilGetParams) => {
    const giftsFrom = get(rGiftsFrom(userId));
    const giftsFor = get(rGiftsFor(userId));
    const fromUserByEpoch = iti(giftsFrom).toGroups((g) => g.epoch_id);
    const forUserByEpoch = iti(giftsFor).toGroups((g) => g.epoch_id);
    const totalReceivedByEpoch = new Map(
      iti(forUserByEpoch.entries()).map(([epochId, arr]) => [
        epochId,
        iti(arr.map((g) => g.tokens)).sum() ?? 0,
      ])
    );
    return {
      fromUser: giftsFrom,
      forUser: giftsFor,
      fromUserByEpoch,
      forUserByEpoch,
      totalReceivedByEpoch,
    };
  },
});
export const useUserGifts = (userId: number) =>
  useRecoilValue(rUserGifts(userId));
