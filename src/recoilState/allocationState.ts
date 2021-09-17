import { atomFamily, selectorFamily, useRecoilValue } from 'recoil';

import {
  STEP_MY_EPOCH,
  STEP_MY_TEAM,
  STEP_ALLOCATION,
  STEPS,
  NO_TEAM_STEPS,
} from 'routes/allocation';

import { rMyProfile, rPendingGiftsFrom, rUsersMap, rMyUsers } from './appState';

import { IUser, ISimpleGift, IRecoilGetParams, IAllocationStep } from 'types';

export const rTeammates = selectorFamily<IUser[], number>({
  key: 'rTeammates',
  get: (circleId: number) => ({ get }: IRecoilGetParams) => {
    const userMap = get(rUsersMap);
    const myUsers = get(rMyUsers);
    return (
      (myUsers
        ?.find((u) => u.circle_id === circleId)
        ?.teammates?.map((t) => userMap.get(t.id))
        .filter((u) => u !== undefined) as IUser[]) ?? []
    );
  },
});

// These are parameterized by circleId
export const rLocalTeammates = atomFamily<IUser[], number>({
  key: 'rLocalTeammates',
  default: [],
});

export const rLocalGifts = atomFamily<ISimpleGift[], number>({
  key: 'rLocalGifts',
  default: [],
});

export const rEpochFirstVisit = selectorFamily<boolean, number>({
  key: 'rEpochFirstVisit',
  get: (circleId: number) => ({ get }: IRecoilGetParams) =>
    get(rMyProfile)?.users?.find((u) => u.circle_id === circleId)
      ?.epoch_first_visit === 1 ?? true,
});

export const useEpochFirstVisit = (circleId: number) =>
  useRecoilValue(rEpochFirstVisit(circleId));

export const rAllocationStepStatus = selectorFamily<
  [Set<IAllocationStep>, IAllocationStep | undefined],
  number
>({
  key: 'rAllocationStepStatus',
  get: (circleId: number) => ({ get }: IRecoilGetParams) => {
    const user = get(rMyProfile)?.users?.find((u) => u.circle_id === circleId);
    if (user === undefined) {
      return [new Set(), STEP_MY_EPOCH];
    }
    const pendingGiftsFrom = get(rPendingGiftsFrom(user.id));
    const completedSteps = new Set<IAllocationStep>();
    if (user.epoch_first_visit === 0) {
      completedSteps.add(STEP_MY_EPOCH);
    }
    if (
      user.epoch_first_visit === 0 &&
      user.teammates &&
      user.teammates.length > 0
    ) {
      completedSteps.add(STEP_MY_TEAM);
    }
    if (pendingGiftsFrom.length > 0) {
      completedSteps.add(STEP_ALLOCATION);
    }
    const steps = user.circle.team_selection === 1 ? STEPS : NO_TEAM_STEPS;
    return [completedSteps, steps.find((step) => !completedSteps.has(step))];
  },
});
export const useAllocationStepStatus = (circleId: number) =>
  useRecoilValue(rAllocationStepStatus(circleId));
