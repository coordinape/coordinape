import { useEffect } from 'react';

import { useRecoilValue, useRecoilState } from 'recoil';

import {
  rLocalTeammates,
  rLocalGifts,
  rLocalGiftsInitialized,
  rPendingGifts,
  rUsersMap,
  rMyCircleUser,
  rMyProfileStaleSignal,
  rSelectedCircle,
  rAvailableTeammates,
} from 'recoilState';
import { getApiService } from 'services/api';

import { useAsync } from './useAsync';

import {
  ICircle,
  ISimpleGift,
  IUser,
  IUserPendingGift,
  PostTokenGiftsParam,
} from 'types';

export const useAllocation = (
  circleId: number | undefined
): {
  localTeammates: IUser[];
  localGifts: ISimpleGift[];
  selectedCircle: ICircle | undefined;
  availableTeammates: IUser[];
  tokenRemaining: number;
  tokenStarting: number;
  tokenAllocated: number;
  givePerUser: Map<number, ISimpleGift>;
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
  const asyncCall = useAsync();

  const [myProfileStaleSignal, setMyProfileStaleSignal] = useRecoilState(
    rMyProfileStaleSignal
  );
  const usersMap = useRecoilValue(rUsersMap);
  const pendingGifts = useRecoilValue(rPendingGifts);
  const selectedCircle = useRecoilValue(rSelectedCircle);
  const availableTeammates = useRecoilValue(rAvailableTeammates);

  const myCircleUser = useRecoilValue(rMyCircleUser(circleId));
  const [localTeammates, setLocalTeammates] = useRecoilState(
    rLocalTeammates(circleId)
  );
  const [localGifts, setLocalGifts] = useRecoilState(rLocalGifts(circleId));
  const [localGiftsInitialized, setLocalGiftsInitialized] = useRecoilState(
    rLocalGiftsInitialized(circleId)
  );

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

  const syncLocalGiftsWithTeammates = (
    newTeammates: IUser[],
    baseGifts: ISimpleGift[]
  ) => {
    const originalSet = new Set(baseGifts.map((g) => g.user.id));
    const newSet = new Set(newTeammates.map((u) => u.id));
    const keepers = [] as ISimpleGift[];
    baseGifts.forEach((g) => {
      if (newSet.has(g.user.id)) {
        keepers.push(g);
      }
    });
    newTeammates.forEach((u) => {
      if (!originalSet.has(u.id)) {
        keepers.push({ user: u, tokens: 0, note: '' } as ISimpleGift);
      }
    });
    setLocalGifts(keepers);
  };

  useEffect(
    () =>
      syncLocalGiftsWithTeammates(myCircleUser?.teammates ?? [], localGifts),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [myCircleUser]
  );

  useEffect(() => {
    if (!localGiftsInitialized) {
      const newGifts = pendingGifts
        .filter((g) => g.sender_id === myCircleUser?.id)
        .map(
          (g) =>
            ({
              user: usersMap.get(g.recipient_id),
              tokens: g.tokens,
              note: g.note,
            } as ISimpleGift)
        );
      syncLocalGiftsWithTeammates(myCircleUser?.teammates ?? [], newGifts);
      setLocalGiftsInitialized(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingGifts]);

  const toggleLocalTeammate = (userId: number) => {
    const newTeammates = localTeammates.find((u) => u.id === userId)
      ? [...localTeammates.filter((u) => u.id !== userId)]
      : [
          ...localTeammates,
          availableTeammates.find((u) => u.id === userId) as IUser,
        ];
    setLocalTeammates(newTeammates);
    syncLocalGiftsWithTeammates(newTeammates, localGifts);
  };

  const setAllLocalTeammates = () => {
    setLocalTeammates(availableTeammates);
    syncLocalGiftsWithTeammates(availableTeammates, localGifts);
  };

  const clearLocalTeammates = () => {
    setLocalTeammates([]);
    syncLocalGiftsWithTeammates([], localGifts);
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
          circle_id: circleId,
          note,
        })
      );

      const result = await getApiService().postTokenGifts(
        circleId,
        myCircleUser.address,
        params
      );

      // TODO: how to update pending tokens for this?
      console.log('saveGifts to rPendingGiftsMap?', result);
      return result;
    };

    return <Promise<IUserPendingGift>>asyncCall(call(), true);
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
    };

    return <Promise<void>>asyncCall(call(), true);
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

  return {
    localTeammates,
    localGifts,
    selectedCircle,
    availableTeammates,
    tokenStarting,
    tokenRemaining,
    tokenAllocated,
    givePerUser,
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
