import { useEffect, useRef } from 'react';

import isEqual from 'lodash/isEqual';
import { useRecoilValue, useRecoilState, useSetRecoilState } from 'recoil';

import {
  rLocalTeammates,
  rLocalGifts,
  rPendingGiftsFrom,
  rUsersMap,
  rMyCircleUser,
  rMyProfileStaleSignal,
  rSelectedCircle,
  rAvailableTeammates,
  rSelectedCircleId,
  rTeammates,
  rPendingGiftsRaw,
  rAllocationStepStatus,
} from 'recoilState';
import { getApiService } from 'services/api';
import { updaterMergeArrayToIdMap } from 'utils/recoilHelpers';

import { useApeSnackbar } from './useApeSnackbar';
import { useAsync } from './useAsync';

import {
  ICircle,
  ISimpleGift,
  IUser,
  ITokenGift,
  IUserPendingGift,
  PostTokenGiftsParam,
  IAllocationStep,
} from 'types';

const syncWithTeammates = (newTeammates: IUser[], newGifts?: ISimpleGift[]) => (
  baseGifts: ISimpleGift[]
) => {
  const startingGifts = newGifts ?? baseGifts;
  const startingSet = new Set(startingGifts.map((g) => g.user.id));
  const newSet = new Set(newTeammates.map((u) => u.id));
  const keepers = [] as ISimpleGift[];
  startingGifts.forEach((g) => {
    if (newSet.has(g.user.id)) {
      keepers.push(g);
    }
  });
  newTeammates.forEach((u) => {
    if (!startingSet.has(u.id)) {
      keepers.push({ user: u, tokens: 0, note: '' } as ISimpleGift);
    }
  });
  return keepers;
};

const pendingGiftsToSimpleGifts = (
  pending: ITokenGift[],
  usersMap: Map<number, IUser>
) =>
  pending.map(
    (g) =>
      ({
        user: usersMap.get(g.recipient_id),
        tokens: g.tokens,
        note: g.note,
      } as ISimpleGift)
  );

export const useAllocationController = (circleId: number | undefined) => {
  if (circleId === undefined) {
    throw 'Cannot useAllocation without a circleId';
  }

  const previousPendingGifts = useRef([] as ITokenGift[]);
  const usersMap = useRecoilValue(rUsersMap);
  const defaultTeammates = useRecoilValue(rTeammates(circleId));
  const [localTeammates, setLocalTeammates] = useRecoilState(
    rLocalTeammates(circleId)
  );
  const myCircleUser = useRecoilValue(rMyCircleUser(circleId));
  if (myCircleUser === undefined) {
    throw `Cannot useAllocation without a user in the in circle ${circleId}`;
  }

  const pendingGifts = useRecoilValue(rPendingGiftsFrom(myCircleUser.id));
  const setLocalGifts = useSetRecoilState(rLocalGifts(circleId));

  useEffect(() => {
    if (isEqual(defaultTeammates, localTeammates)) {
      return;
    }
    setLocalTeammates(defaultTeammates);
  }, [defaultTeammates]);

  useEffect(
    () => setLocalGifts(syncWithTeammates(myCircleUser?.teammates ?? [])),

    [myCircleUser]
  );

  useEffect(() => {
    if (isEqual(pendingGifts, previousPendingGifts.current)) {
      return;
    }
    previousPendingGifts.current = pendingGifts;

    const newGifts = pendingGiftsToSimpleGifts(pendingGifts, usersMap);
    setLocalGifts(syncWithTeammates(myCircleUser?.teammates ?? [], newGifts));
  }, [pendingGifts]);
};

export const useAllocation = (
  circleId: number | undefined
): {
  localTeammates: IUser[];
  localGifts: ISimpleGift[];
  localTeammatesDirty: boolean;
  localGiftsDirty: boolean;
  selectedCircle: ICircle | undefined;
  availableTeammates: IUser[];
  tokenRemaining: number;
  tokenStarting: number;
  tokenAllocated: number;
  givePerUser: Map<number, ISimpleGift>;
  nextStep: IAllocationStep | undefined;
  completedSteps: Set<IAllocationStep>;
  toggleLocalTeammate: (userId: number) => void;
  setAllLocalTeammates: () => void;
  clearLocalTeammates: () => void;
  setLocalGifts: (gifts: ISimpleGift[]) => void;
  rebalanceGifts: () => void;
  saveGifts: () => Promise<IUserPendingGift>;
  saveTeammates: () => Promise<void>;
  updateGift: (id: number, params: { note?: string; tokens?: number }) => void;
} => {
  if (circleId === undefined) {
    throw 'Cannot useAllocation without a circleId';
  }
  const { apeInfo } = useApeSnackbar();
  const asyncCall = useAsync();

  const [myProfileStaleSignal, setMyProfileStaleSignal] = useRecoilState(
    rMyProfileStaleSignal
  );
  const defaultTeammates = useRecoilValue(rTeammates(circleId));
  const usersMap = useRecoilValue(rUsersMap);
  const selectedCircle = useRecoilValue(rSelectedCircle);
  const availableTeammates = useRecoilValue(rAvailableTeammates);
  const [completedSteps, nextStep] = useRecoilValue(
    rAllocationStepStatus(circleId)
  );

  const myCircleUser = useRecoilValue(rMyCircleUser(circleId));
  if (myCircleUser === undefined) {
    throw 'Cannot useAllocation without a loaded user in this circle';
  }
  const setPendingGiftsMap = useSetRecoilState(rPendingGiftsRaw);
  const pendingGifts = useRecoilValue(rPendingGiftsFrom(myCircleUser.id));
  const [localTeammates, setLocalTeammates] = useRecoilState(
    rLocalTeammates(circleId)
  );
  const [localGifts, setLocalGifts] = useRecoilState(rLocalGifts(circleId));

  const tokenStarting =
    myCircleUser?.non_giver !== 0 ? 0 : myCircleUser.starting_tokens;
  const tokenAllocated = Array.from(localGifts).reduce(
    (sum, { tokens }: ISimpleGift) => sum + tokens,
    0
  );
  const tokenRemaining = tokenStarting - tokenAllocated;
  const teammateReceiverCount = localGifts
    .map((g) => (g.user.non_receiver ? 0 : 1))
    .reduce((a: number, b: number) => a + b, 0);

  const givePerUser = new Map(localGifts.map((g) => [g.user.id, g]));

  const toggleLocalTeammate = (userId: number) => {
    const newTeammates = localTeammates.find((u) => u.id === userId)
      ? [...localTeammates.filter((u) => u.id !== userId)]
      : [
          ...localTeammates,
          availableTeammates.find((u) => u.id === userId) as IUser,
        ];
    setLocalTeammates(newTeammates);
    setLocalGifts(syncWithTeammates(newTeammates));
  };

  const setAllLocalTeammates = () => {
    setLocalTeammates(availableTeammates);
    setLocalGifts(syncWithTeammates(availableTeammates));
  };

  const clearLocalTeammates = () => {
    setLocalTeammates([]);
    setLocalGifts(syncWithTeammates([]));
  };

  const updateGift = (
    id: number,
    { note, tokens }: { note?: string; tokens?: number }
  ) => {
    const idx = localGifts.findIndex((g) => g.user.id === id);
    const original = localGifts[idx];
    const user = usersMap.get(id);
    if (!user) {
      throw `User ${id} not found in userMap`;
    }
    if (idx === -1) {
      return [
        ...localGifts,
        { user, tokens: tokens ?? 0, note: note ?? '' } as ISimpleGift,
      ];
    }
    const copy = localGifts.slice();
    copy[idx] = {
      user,
      tokens: tokens !== undefined ? tokens : original.tokens,
      note: note !== undefined ? note : original.note,
    };
    setLocalGifts(copy);
  };

  const rebalanceGifts = () => {
    if (teammateReceiverCount === 0) {
      return;
    }
    if (tokenAllocated === 0) {
      setLocalGifts(
        localGifts.slice().map((g) => {
          return {
            ...g,
            tokens: Math.floor(tokenStarting / teammateReceiverCount),
          };
        })
      );
    } else {
      const rebalance = tokenStarting / tokenAllocated;
      setLocalGifts(
        localGifts
          .slice()
          .map((g) => ({ ...g, tokens: Math.floor(g.tokens * rebalance) }))
      );
    }
  };

  const saveTeammates = async () => {
    const call = async () => {
      if (!myCircleUser) {
        throw 'Must have a circleUser to saveTeammates';
      }

      const result = await getApiService().postTeammates(
        myCircleUser.circle_id,
        myCircleUser.address,
        localTeammates.map((u) => u.id)
      );
      // TODO: This returns the updated circleUser and it
      // could just be updated immediatly here. So instead of this
      // stale, the fetcher pattern is better. The fetchers could
      // also be compatible with useAsyncCall
      setMyProfileStaleSignal(myProfileStaleSignal + 1);
      apeInfo('Saved Teammates');
    };

    return <Promise<void>>asyncCall(call(), true);
  };

  const saveGifts = async () => {
    const call = async () => {
      if (!myCircleUser) {
        return;
      }
      const params: PostTokenGiftsParam[] = localGifts.map(
        ({ user, tokens, note }) => ({
          tokens,
          recipient_id: user.id,
          note,
        })
      );

      const result = await getApiService().postTokenGifts(
        circleId,
        myCircleUser.address,
        params
      );

      updaterMergeArrayToIdMap(
        result.pending_sent_gifts as ITokenGift[],
        setPendingGiftsMap
      );
      return result;
    };

    return <Promise<IUserPendingGift>>asyncCall(call(), true);
  };

  const simpleGiftsToTuple = (gifts: ISimpleGift[]) =>
    gifts
      .slice()
      .sort((a, b) => a.user.id - b.user.id)
      .map((g) => [g.user.id, g.tokens, g.note]);

  const localGiftsDirty = !isEqual(
    simpleGiftsToTuple(
      localGifts.filter((g) => g.note !== '' || g.tokens > 0).map((lg) => lg)
    ),
    simpleGiftsToTuple(pendingGiftsToSimpleGifts(pendingGifts, usersMap))
  );

  return {
    localTeammates,
    localGifts,
    localGiftsDirty,
    localTeammatesDirty: !isEqual(localTeammates, defaultTeammates),
    selectedCircle,
    availableTeammates,
    tokenStarting,
    tokenRemaining,
    tokenAllocated,
    givePerUser,
    nextStep,
    completedSteps,
    toggleLocalTeammate,
    setAllLocalTeammates,
    clearLocalTeammates,
    setLocalGifts,
    rebalanceGifts,
    saveGifts,
    saveTeammates,
    updateGift,
  };
};

export const useSelectedAllocation = () =>
  useAllocation(useRecoilValue(rSelectedCircleId));

export const useSelectedAllocationController = () =>
  useAllocationController(useRecoilValue(rSelectedCircleId));
