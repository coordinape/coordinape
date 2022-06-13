import { paths } from './paths';

import { IAllocationStep } from 'types';
// TODO: Move these to constants along with paths

export const STEP_MY_EPOCH = {
  key: 0,
  buildLabel: () => 'My Epoch',
  pathFn: paths.epoch,
} as IAllocationStep;

export const STEP_MY_TEAM = {
  key: 1,
  buildLabel: () => 'Select Team',
  pathFn: paths.team,
} as IAllocationStep;

export const STEP_ALLOCATION = {
  key: 2,
  buildLabel: circle => {
    return `Allocate ${circle.tokenName}`;
  },
  pathFn: paths.give,
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
