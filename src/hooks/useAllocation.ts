import { useEffect, useRef } from 'react';

import iti from 'itiriri';
import isEqual from 'lodash/isEqual';
import { useRecoilValue, useRecoilState, useSetRecoilState } from 'recoil';

import {
  rLocalTeammates,
  rLocalGifts,
  rPendingGiftsFrom,
  rUsersMap,
  rMyCircleUser,
  rAvailableTeammates,
  rSelectedCircleId,
  rTeammates,
  rLocalTeammatesChanged,
  rPendingGiftsRaw,
  rAllocationStepStatus,
  useTriggerProfileReload,
} from 'recoilState';
import { getApiService } from 'services/api';
import { updaterMergeArrayToIdMap } from 'utils/recoilHelpers';

import { useAsyncLoadCatch } from './useAsyncLoadCatch';
import { useDeepChangeEffect } from './useDeepChangeEffect';

import {
  ISimpleGift,
  IUser,
  IApiUser,
  ITokenGift,
  IApiTokenGift,
  PostTokenGiftsParam,
} from 'types';

/**
 * Updater for gifts, for non-empty gifts and teammates.
 *
 * @param newTeammates - Include these.
 * @param newGifts - Overwrite the existing gifts.
 */
const getLocalGiftUpdater = (
  newTeammates: IApiUser[],
  newGifts?: ISimpleGift[]
) => (baseGifts: ISimpleGift[]) => {
  const startingGifts = newGifts ?? baseGifts;
  const startingSet = new Set(startingGifts.map((g) => g.user.id));
  const newSet = new Set(newTeammates.map((u) => u.id));
  const keepers = [] as ISimpleGift[];
  startingGifts.forEach((g) => {
    if (newSet.has(g.user.id) || g.note !== '' || g.tokens > 0) {
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

/**
 * Updater for pendingGifts that clears other gifts from this user.
 *
 * When the API returns the pending gifts for a given user by implication
 * gifts from the user that are not included have been deleted.
 */
const getPendingGiftUpdater = (gifts: IApiTokenGift[], userId: number) => (
  oldValue: Map<number, IApiTokenGift>
) => {
  const giftMap = new Map(oldValue);
  giftMap.forEach((g) => {
    if (g.sender_id === userId) {
      giftMap.delete(g.id);
    }
  });
  gifts.forEach((v) => giftMap.set(v.id, v));
  return giftMap;
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

type tokenNote = [number, string];

const simpleGiftsToMap = (source: ISimpleGift[]): Map<number, tokenNote> =>
  new Map(source.map((g) => [g.user.id, [g.tokens, g.note]]));

const pendingGiftMap = (pending: ITokenGift[]): Map<number, tokenNote> =>
  new Map(pending.map((g) => [g.recipient_id, [g.tokens, g.note]]));

const buildDiffMap = (
  remoteMap: Map<number, tokenNote>,
  localMap: Map<number, tokenNote>
) => {
  const diff = iti(localMap.keys()).reduce<Map<number, tokenNote>>(
    (changes: Map<number, tokenNote>, key: number) => {
      // changes is initialized as remote,
      if (!changes.has(key)) {
        const tn = localMap.get(key) as tokenNote;
        if (tn[0] !== 0 || tn[1] !== '') {
          changes.set(key, tn);
        }
      } else {
        const remote = changes.get(key) as tokenNote;
        const local = localMap.get(key) as tokenNote;
        if (isEqual(remote, local)) {
          changes.delete(key);
        } else {
          changes.set(key, local);
        }
      }
      return changes;
    },
    new Map(remoteMap)
  );

  return diff;
};

/**
 * Controller: triggers updates if the underlying data from the api changes.
 */
export const useAllocationController = (circleId: number | undefined) => {
  if (circleId === undefined) {
    throw 'Cannot useAllocation without a circleId';
  }
  const usersMap = useRecoilValue(rUsersMap);
  const teammates = useRecoilValue(rTeammates(circleId));
  const [localTeammates, setLocalTeammates] = useRecoilState(
    rLocalTeammates(circleId)
  );
  const myCircleUser = useRecoilValue(rMyCircleUser(circleId));
  if (myCircleUser === undefined) {
    throw `Cannot useAllocation without a user in the in circle ${circleId}`;
  }

  const pendingGifts = useRecoilValue(rPendingGiftsFrom(myCircleUser.id));
  const setLocalGifts = useSetRecoilState(rLocalGifts(circleId));

  useDeepChangeEffect(() => {
    setLocalTeammates(teammates);
    setLocalGifts(getLocalGiftUpdater(teammates));
  }, [teammates]);

  useDeepChangeEffect(() => {
    const newGifts = pendingGiftsToSimpleGifts(pendingGifts, usersMap);
    setLocalGifts(getLocalGiftUpdater(localTeammates, newGifts));
  }, [pendingGifts]);
};

/**
 * Methods and state for an allocation.
 */
export const useAllocation = (circleId: number | undefined) => {
  if (circleId === undefined) {
    throw 'Cannot useAllocation without a circleId';
  }
  const callWithLoadCatch = useAsyncLoadCatch();

  const triggerProfileReload = useTriggerProfileReload();
  const localTeammatesChanged = useRecoilValue(
    rLocalTeammatesChanged(circleId)
  );
  const usersMap = useRecoilValue(rUsersMap);
  const availableTeammates = useRecoilValue(rAvailableTeammates);
  const [completedSteps] = useRecoilValue(rAllocationStepStatus(circleId));

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

  const localGiftsChanged =
    buildDiffMap(pendingGiftMap(pendingGifts), simpleGiftsToMap(localGifts))
      .size > 0;

  const toggleLocalTeammate = (userId: number) => {
    if (myCircleUser.circle.team_selection === 0) {
      console.error('toggleLocalTeammate with circle without team selection');
      return;
    }
    const newTeammates = localTeammates.find((u) => u.id === userId)
      ? [...localTeammates.filter((u) => u.id !== userId)]
      : [
          ...localTeammates,
          availableTeammates.find((u) => u.id === userId) as IUser,
        ];
    setLocalTeammates(newTeammates);
    setLocalGifts(getLocalGiftUpdater(newTeammates));
  };

  const setAllLocalTeammates = () => {
    if (myCircleUser.circle.team_selection === 0) {
      console.error('toggleLocalTeammate with circle without team selection');
      return;
    }
    setLocalTeammates(availableTeammates);
    setLocalGifts(getLocalGiftUpdater(availableTeammates));
  };

  const clearLocalTeammates = () => {
    if (myCircleUser.circle.team_selection === 0) {
      console.error('toggleLocalTeammate with circle without team selection');
      return;
    }
    setLocalTeammates([]);
    setLocalGifts(getLocalGiftUpdater([]));
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

  const saveTeammates = () =>
    callWithLoadCatch(
      async () => {
        if (!myCircleUser) {
          throw 'Must have a circleUser to saveTeammates';
        }

        const result = await getApiService().postTeammates(
          myCircleUser.circle_id,
          myCircleUser.address,
          localTeammates.map((u) => u.id)
        );

        setPendingGiftsMap(
          getPendingGiftUpdater(result.pending_sent_gifts, result.id)
        );
        triggerProfileReload();
      },
      {
        success: 'Saved Teammates',
        transformError: (e) =>
          (e.message = `With hardware wallets, try shorter changes. ${e.message}`),
      }
    );

  const saveGifts = () =>
    callWithLoadCatch(
      async () => {
        if (!myCircleUser) {
          throw 'Must have a circleUser to saveGifts';
        }

        const diff = buildDiffMap(
          pendingGiftMap(pendingGifts),
          simpleGiftsToMap(localGifts)
        );

        const params: PostTokenGiftsParam[] = iti(diff.entries())
          .map(([userId, [tokens, note]]) => ({
            tokens,
            recipient_id: userId,
            note,
          }))
          .toArray();

        const result = await getApiService().postTokenGifts(
          circleId,
          myCircleUser.address,
          params
        );

        setPendingGiftsMap(
          getPendingGiftUpdater(result.pending_sent_gifts, result.id)
        );

        return result.pending_sent_gifts;
      },
      { success: 'Saved Gifts' }
    );

  return {
    localTeammates,
    localGifts,
    localGiftsChanged,
    localTeammatesChanged,
    tokenRemaining,
    givePerUser,
    completedSteps,
    toggleLocalTeammate,
    setAllLocalTeammates,
    clearLocalTeammates,
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
