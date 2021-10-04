import { getMyTeamPath, getMyEpochPath, getGivePath } from './paths';

import { IAllocationStep } from 'types';
// TODO: Move these to constants along with paths

export const STEP_MY_EPOCH = {
  key: 0,
  label: 'My Epoch',
  path: getMyEpochPath(),
} as IAllocationStep;

export const STEP_MY_TEAM = {
  key: 1,
  label: 'Select Team',
  path: getMyTeamPath(),
} as IAllocationStep;

export const STEP_ALLOCATION = {
  key: 2,
  label: 'Allocate Give',
  path: getGivePath(),
} as IAllocationStep;

export const STEPS: IAllocationStep[] = [
  STEP_MY_EPOCH,
  STEP_MY_TEAM,
  STEP_ALLOCATION,
];

export const NO_TEAM_STEPS: IAllocationStep[] = [
  STEP_MY_EPOCH,
  STEP_ALLOCATION,
];
