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

import {
  rSelectedCircleId,
  rUsersMap,
  rGiftsMap,
  rCircle,
  rMyProfile,
} from './app';

import { IUser, ISimpleGift, IAllocationStep } from 'types';

export const rGiftsByEpoch = selector({
  key: 'rGiftsByEpoch',
  get: ({ get }) => iti(get(rGiftsMap).values()).toGroups(g => g.epoch_id),
});

export const rUserGifts = selectorFamily({
  key: 'rUserGifts',
  get:
    (userId: number) =>
    ({ get }) => {
      const sortedGifts = Array.from(get(rGiftsMap).values()).sort(
        ({ id: a }, { id: b }) => a - b
      );
      const giftsFrom = iti(sortedGifts)
        .filter(g => g.sender_id === userId)
        .toArray();
      const giftsFor = iti(sortedGifts)
        .filter(g => g.recipient_id === userId)
        .toArray();
      const fromUserByEpoch = iti(giftsFrom).toGroups(g => g.epoch_id);
      const forUserByEpoch = iti(giftsFor).toGroups(g => g.epoch_id);
      const totalReceivedByEpoch = new Map(
        iti(forUserByEpoch.entries()).map(([epochId, arr]) => [
          epochId,
          iti(arr.map(g => g.tokens)).sum() ?? 0,
        ])
      );
      return {
        pendingGiftsFrom: [...giftsFrom].filter(g => g.pending),
        pendingGiftsFor: [...giftsFor].filter(g => g.pending),
        fromUser: giftsFrom,
        forUser: giftsFor,
        fromUserByEpoch,
        forUserByEpoch,
        totalReceivedByEpoch,
      };
    },
});

export const rAvailableTeammates = selector({
  key: 'rAvailableTeammates',
  get: ({ get }) => {
    const selectedCircleId = get(rSelectedCircleId);
    const { myUser } = get(rCircle(selectedCircleId));
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

export const rBaseTeammates = selectorFamily<IUser[], number>({
  key: 'rBaseTeammates',
  get:
    (circleId: number) =>
    ({ get }) => {
      const { myUser } = get(rCircle(circleId));

      if (!myUser.circle.team_selection) {
        return get(rAvailableTeammates);
      }

      const teammateIds = myUser.teammates.map(t => t.id);
      return get(rAvailableTeammates).filter(t => teammateIds.includes(t.id));
    },
});

export const rLocalTeammates = atomFamily({
  key: 'rLocalTeammates',
  default: rBaseTeammates,
});

export const rLocalTeammatesChanged = selectorFamily({
  key: 'rLocalTeammatesChanged',
  get:
    (circleId: number) =>
    ({ get }) =>
      !isEqual(get(rBaseTeammates(circleId)), get(rLocalTeammates(circleId))),
});

export const rLocalGifts = atomFamily<ISimpleGift[], number>({
  key: 'rLocalGifts',
  default: [],
});

// WTFLOL: selectorFamily only allows a single number parameter, so we use this
// and the wrapper below to combine multiple params into a single one
const PARAM_OFFSET = 1000000;

const rLocalGiftRaw = selectorFamily<ISimpleGift, number>({
  key: 'rLocalGift',
  get:
    (circleAndUserId: number) =>
    ({ get }) => {
      const userId = Math.floor(circleAndUserId / PARAM_OFFSET);
      const circleId = circleAndUserId % PARAM_OFFSET;
      return get(rLocalGifts(circleId)).find(
        gift => gift.user.id === userId
      ) as ISimpleGift;
    },
  set:
    (circleAndUserId: number) =>
    ({ get, set }, updatedGift) => {
      const userId = Math.floor(circleAndUserId / PARAM_OFFSET);
      const circleId = circleAndUserId % PARAM_OFFSET;
      const tokens = Math.max(0, (updatedGift as ISimpleGift)?.tokens || 0);
      const note = (updatedGift as ISimpleGift)?.note || '';

      const localGifts: ISimpleGift[] = get(rLocalGifts(circleId));
      const idx = localGifts.findIndex(g => g.user.id === userId);

      let updatedGifts;
      if (idx === -1) {
        const user = get(rUsersMap).get(userId);
        updatedGifts = [...localGifts, { user, tokens, note } as ISimpleGift];
      } else {
        const gift = localGifts[idx];
        updatedGifts = localGifts.slice();
        updatedGifts[idx] = { user: gift.user, tokens, note };
      }

      // prevent giving more than you have
      const {
        myUser: { non_giver, starting_tokens },
      } = get(rCircle(circleId));
      const total = updatedGifts.reduce((t, g) => t + g.tokens, 0);
      if (total > (non_giver ? 0 : starting_tokens)) return;

      set(rLocalGifts(circleId), updatedGifts);
    },
});

export const rLocalGift = (userId: number, circleId: number) =>
  rLocalGiftRaw(userId * PARAM_OFFSET + circleId);

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
      const pendingGiftsFrom = get(rUserGifts(user.id)).pendingGiftsFrom;
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
