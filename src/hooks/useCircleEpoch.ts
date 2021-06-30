import { useRecoilValue } from 'recoil';

import { rCircleEpochTiming, rCircleEpochsStatus } from 'recoilState';

import { ITiming, IEpochTiming, IEpoch } from 'types';

// TODO: These could be in utils
const timingToLeastUnit = (timing: ITiming) => {
  if (timing.days > 0) {
    return timing.days === 1 ? '1 day' : `${timing.days} days`;
  }
  if (timing.hours > 0) {
    return timing.hours === 1 ? '1 hour' : `${timing.hours} hours`;
  }
  if (timing.minutes > 0) {
    return timing.minutes === 1 ? '1 minute' : `${timing.minutes} minutes`;
  }
  if (timing.seconds > 0) {
    return timing.seconds === 1 ? '1 second' : `${timing.seconds} seconds`;
  }
  return 'the past';
};

const timingToMessage = (epochTiming?: IEpochTiming) => {
  if (!epochTiming) {
    return 'Epoch not Scheduled';
  }
  if (!epochTiming.hasBegun) {
    return `Epoch begins in ${timingToLeastUnit(epochTiming.timeUntilStart)}`;
  }
  return `Epoch ends in ${timingToLeastUnit(epochTiming.timeUntilEnd)}`;
};

export const useCircleEpoch = (
  circleId: number
): {
  circleId: number;
  pastEpochs: IEpoch[];
  currentEpoch?: IEpoch;
  nextEpoch?: IEpoch;
  epochIsActive: boolean;
  timingMessage: string;
} => {
  const epochStatus = useRecoilValue(rCircleEpochsStatus(circleId));
  const epochTimings = useRecoilValue(rCircleEpochTiming(circleId));
  const nextTiming = epochTimings?.nextEpochTiming;

  // TODO: This is broken for some coordinape testing....
  return {
    circleId,
    pastEpochs: epochStatus?.pastEpochs,
    currentEpoch: epochStatus?.currentEpoch,
    epochIsActive: !!epochStatus?.currentEpoch,
    timingMessage: timingToMessage(
      nextTiming ?? epochTimings?.currentEpochTiming
    ),
  };
};
