import iti from 'itiriri';
import isEqual from 'lodash/isEqual';
import { atomFamily, selectorFamily, useRecoilValue, selector } from 'recoil';

import {
  STEP_MY_EPOCH,
  STEP_MY_TEAM,
  STEP_ALLOCATION,
  STEPS,
  NO_TEAM_STEPS,
} from 'routes/allocation';
import { neverEndingPromise } from 'utils/tools';

import {
  rSelectedCircleId,
  rUsersMap,
  rGiftsMap,
  rPendingGiftsMap,
  rCircleState,
  rMyProfile,
} from './app';

import { IUser, ISimpleGift, IAllocationStep } from 'types';

export const rGifts = selector({
  key: 'rGifts',
  get: ({ get }) =>
    Array.from(get(rGiftsMap).values()).sort(({ id: a }, { id: b }) => a - b),
});

export const rGiftsByEpoch = selector({
  key: 'rGiftsByEpoch',
  get: ({ get }) => iti(get(rGifts)).toGroups(g => g.epoch_id),
});

export const rPendingGiftsFor = selectorFamily({
  key: 'rPendingGiftsFor',
  get:
    (userId: number) =>
    ({ get }) =>
      iti(get(rPendingGiftsMap).values())
        .filter(g => g.recipient_id === userId)
        .toArray(),
});

export const rPendingGiftsFrom = selectorFamily({
  key: 'rPendingGiftsFrom',
  get:
    (userId: number) =>
    ({ get }) =>
      iti(get(rPendingGiftsMap).values())
        .filter(g => g.sender_id === userId)
        .toArray(),
});

export const rGiftsFor = selectorFamily({
  key: 'rGiftsFor',
  get:
    (userId: number) =>
    ({ get }) =>
      get(rGifts).filter(g => g.recipient_id === userId),
});

export const rGiftsFrom = selectorFamily({
  key: 'rGiftsFrom',
  get:
    (userId: number) =>
    ({ get }) =>
      get(rGifts).filter(g => g.sender_id === userId),
});

export const rUserGifts = selectorFamily({
  key: 'rUserGifts',
  get:
    (userId: number) =>
    ({ get }) => {
      const pendingGiftsFrom = get(rPendingGiftsFrom(userId));
      const pendingGiftsFor = get(rPendingGiftsFor(userId));
      const giftsFrom = get(rGiftsFrom(userId));
      const giftsFor = get(rGiftsFor(userId));
      const fromUserByEpoch = iti(giftsFrom).toGroups(g => g.epoch_id);
      const forUserByEpoch = iti(giftsFor).toGroups(g => g.epoch_id);
      const totalReceivedByEpoch = new Map(
        iti(forUserByEpoch.entries()).map(([epochId, arr]) => [
          epochId,
          iti(arr.map(g => g.tokens)).sum() ?? 0,
        ])
      );
      return {
        pendingGiftsFrom,
        pendingGiftsFor,
        fromUser: giftsFrom,
        forUser: giftsFor,
        fromUserByEpoch,
        forUserByEpoch,
        totalReceivedByEpoch,
      };
    },
});

///
///
///
///

// TODO: Refactor into grouping?
export const rAvailableTeammates = selector({
  key: 'rAvailableTeammates',
  get: ({ get }) => {
    const selectedCircleId = get(rSelectedCircleId);
    const { myUser } = get(rCircleState(selectedCircleId));
    const usersMap = get(rUsersMap);
    return iti(usersMap.values())
      .filter(
        u =>
          !u.deleted_at &&
          u.id !== myUser?.id &&
          u.circle_id === selectedCircleId
      )
      .toArray();
  },
});

// TODO: Refactor into grouping?
export const rTeammates = selectorFamily<IUser[], number>({
  key: 'rTeammates',
  get:
    (circleId: number) =>
    ({ get }) => {
      const userMap = get(rUsersMap);
      const { myUsers } = get(rMyProfile);
      const currentUser = myUsers?.find(u => u.circle_id === circleId);
      if (!currentUser) {
        return neverEndingPromise();
      }

      if (!currentUser.circle.team_selection) {
        return get(rAvailableTeammates);
      }

      return currentUser.teammates
        .map(t => userMap.get(t.id))
        .filter(u => u !== undefined) as IUser[];
    },
});

export const rLocalTeammates = atomFamily({
  key: 'rLocalTeammates',
  default: rTeammates,
});

export const rLocalTeammatesChanged = selectorFamily({
  key: 'rLocalTeammatesChanged',
  get:
    (circleId: number) =>
    ({ get }) =>
      !isEqual(get(rTeammates(circleId)), get(rLocalTeammates(circleId))),
});

export const rLocalGifts = atomFamily<ISimpleGift[], number>({
  key: 'rLocalGifts',
  default: [],
});

export const rEpochFirstVisit = selectorFamily<boolean, number>({
  key: 'rEpochFirstVisit',
  get:
    (circleId: number) =>
    ({ get }) =>
      get(rMyProfile).myUsers?.find(u => u.circle_id === circleId)
        ?.epoch_first_visit ?? true,
});

export const rAllocationStepStatus = selectorFamily<
  [Set<IAllocationStep>, IAllocationStep | undefined],
  number
>({
  key: 'rAllocationStepStatus',
  get:
    (circleId: number) =>
    ({ get }) => {
      const user = get(rMyProfile).myUsers?.find(u => u.circle_id === circleId);
      if (user === undefined) {
        return [new Set(), STEP_MY_EPOCH];
      }
      const pendingGiftsFrom = get(rPendingGiftsFrom(user.id));
      const completedSteps = new Set<IAllocationStep>();
      if (!user.epoch_first_visit) {
        completedSteps.add(STEP_MY_EPOCH);
      }
      if (
        !user.epoch_first_visit &&
        user.teammates &&
        user.teammates.length > 0
      ) {
        completedSteps.add(STEP_MY_TEAM);
      }
      if (pendingGiftsFrom.length > 0) {
        completedSteps.add(STEP_ALLOCATION);
      }
      const steps = user.circle.team_selection ? STEPS : NO_TEAM_STEPS;
      return [completedSteps, steps.find(step => !completedSteps.has(step))];
    },
});

export const useUserGifts = (userId: number) =>
  useRecoilValue(rUserGifts(userId));

export const useAllocationStepStatus = (circleId: number) =>
  useRecoilValue(rAllocationStepStatus(circleId));
