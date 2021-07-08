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
import storage from 'utils/storage';
import { calculateEpochTimings, giftsToEpochMap } from 'utils/tools';

import { rMyAddress } from './walletState';

import {
  IUser,
  IEpoch,
  ICircle,
  IRecoilGetParams,
  IProfile,
  ITokenGift,
  IEpochTimings,
} from 'types';

// TODO: Array.from seems heavy weight, replace with an iterator. I tried
// but ran into delays seeing how to get typescript compatible.

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

export const rInitialized = atom<boolean>({
  key: 'rInitialized',
  default: false,
});
export const useValInitialized = () => useRecoilValue(rInitialized);
export const useStateInitialized = () => useRecoilState(rInitialized);
export const useSetInitialized = () => useSetRecoilState(rInitialized);

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
export const useValMyProfile = () => useRecoilValue(rMyProfile);

export const rMyUsers = selector<IUser[]>({
  key: 'rMyUsers',
  get: ({ get }: IRecoilGetParams) => {
    const profile = get(rMyProfile);
    return profile?.users ?? [];
  },
});

export const rHasAdminView = selector<boolean>({
  key: 'rHasAdminView',
  get: ({ get }: IRecoilGetParams) =>
    get(rMyUsers).some((u) => u.admin_view > 0),
});

export const rMyCircleUser = selectorFamily<IUser | undefined, number>({
  key: 'rMyCircleUser',
  get: (circleId: number) => ({ get }: IRecoilGetParams) =>
    get(rMyUsers).find((u) => u.circle_id === circleId),
});

export const rSelectedMyUser = selector<IUser | undefined>({
  key: 'rSelectedMyUser',
  get: async ({ get }: IRecoilGetParams) => {
    const selectedCircleId = get(rSelectedCircleId);
    return get(rMyUsers).find((u) => u.circle_id === selectedCircleId);
  },
});
export const useSelectedMyUser = () => useRecoilValue(rSelectedMyUser);

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

const circleWithDefaults = (circle: ICircle): ICircle => {
  const tokenName = circle.token_name || 'GIVE';
  const circleCopy = { ...circle } as ICircle;
  circleCopy.token_name = tokenName;
  circleCopy.team_sel_text = `Select the people you have been working with during this epoch so you can thank them with ${tokenName}`;
  circleCopy.alloc_text = `Thank your teammates by allocating them ${tokenName}`;
  return circleCopy;
};

// TODO: This may be memory inefficient in the future, consider adding getters.
const createGiftWithUser = (usersMap: Map<number, IUser>) => (
  gift: ITokenGift
) => {
  const giftCopy = { ...gift } as ITokenGift;
  giftCopy.sender = usersMap.get(gift.sender_id);
  giftCopy.recipient = usersMap.get(gift.recipient_id);
  return giftCopy;
};

export const rCirclesMap = atom<Map<number, ICircle>>({
  key: 'rCirclesMap',
  default: new Promise((resolve) => {
    getApiService()
      .getCircles()
      .then((circles) =>
        resolve(
          new Map(
            circles.map((c) => circleWithDefaults(c)).map((c) => [c.id, c])
          )
        )
      );
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

export const rGiftsRaw = atom<Map<number, ITokenGift>>({
  key: 'rGiftsRaw',
  default: new Map(),
});

export const rGiftsMap = selector<Map<number, ITokenGift>>({
  key: 'rGiftsMap',
  get: ({ get }: IRecoilGetParams) =>
    new Map(
      Array.from(get(rGiftsRaw).values())
        .map(createGiftWithUser(get(rUsersMap)))
        .map((g) => [g.id, g])
    ),
});

export const rGifts = selector<ITokenGift[]>({
  key: 'rGifts',
  get: ({ get }: IRecoilGetParams) => Array.from(get(rGiftsMap).values()),
});

export const rPendingGiftsRaw = atom<Map<number, ITokenGift>>({
  key: 'rPendingGiftsRaw',
  default: new Map(),
});

export const rPendingGiftsMap = selector<Map<number, ITokenGift>>({
  key: 'rPendingGiftsMap',
  get: ({ get }: IRecoilGetParams) =>
    new Map(
      Array.from(get(rPendingGiftsRaw).values())
        .map(createGiftWithUser(get(rUsersMap)))
        .map((g) => [g.id, g])
    ),
});

export const rPendingGifts = selector<ITokenGift[]>({
  key: 'rPendingGifts',
  get: ({ get }: IRecoilGetParams) =>
    Array.from(get(rPendingGiftsMap).values()).sort(
      ({ id: a }, { id: b }) => a - b
    ),
});

export const rAllGiftsMap = selector<Map<number, ITokenGift>>({
  key: 'rAllGiftsMap',
  get: ({ get }: IRecoilGetParams) =>
    new Map(
      iti(get(rPendingGiftsMap).values())
        .concat(get(rGiftsMap).values())
        .map((g) => [g.id, g])
    ),
});

export const rAllGifts = selector<ITokenGift[]>({
  key: 'rAllGifts',
  get: ({ get }: IRecoilGetParams) =>
    Array.from(get(rAllGiftsMap).values()).sort(
      ({ id: a }, { id: b }) => a - b
    ),
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
    return circlesMap.get(selectedCircleId ?? -1);
  },
});
export const useValSelectedCircle = () => useRecoilValue(rSelectedCircle);

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

export const rGiftsFor = selectorFamily<ITokenGift[], number>({
  key: 'rGiftsFor',
  get: (userId: number) => ({ get }: IRecoilGetParams) =>
    get(rAllGifts).filter((g) => g.recipient_id === userId),
});
export const useValGiftsFor = (userId: number) =>
  useRecoilValue(rGiftsFor(userId));

export const rGiftsFrom = selectorFamily<ITokenGift[], number>({
  key: 'rGiftsFrom',
  get: (userId: number) => ({ get }: IRecoilGetParams) =>
    get(rAllGifts).filter((g) => g.sender_id === userId),
});
export const useValGiftsFrom = (userId: number) =>
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
    const fromUserByEpoch = giftsToEpochMap(giftsFrom);
    const forUserByEpoch = giftsToEpochMap(giftsFor);
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
export const useValUserGifts = (userId: number) =>
  useRecoilValue(rUserGifts(userId));

export const rEpochTotalGive = selectorFamily<number, number>({
  key: 'rEpochTotalGive',
  get: (epochId: number) => ({ get }: IRecoilGetParams) =>
    iti(get(rAllGifts))
      .filter((g) => g.epoch_id === epochId)
      .map((g) => g.tokens)
      .sum() ?? 0,
});
export const useValEpochTotalGive = (epochId: number) =>
  useRecoilValue(rEpochTotalGive(epochId));
