import { useRecoilValue } from 'recoil';

import { rCircleEpochsStatus } from 'recoilState';
import { timingToLeastUnit, calculateEpochTimings } from 'utils/tools';

import { IEpoch } from 'types';

export const useCircleEpoch = (
  circleId: number | undefined
): {
  circleId: number | undefined;
  pastEpochs: IEpoch[];
  previousEpoch?: IEpoch;
  currentEpoch?: IEpoch;
  nextEpoch?: IEpoch;
  epochIsActive: boolean;
  timingMessage: string;
  longTimingMessage: string;
} => {
  // A fake circleId will just return nothing.
  const { pastEpochs, previousEpoch, currentEpoch, nextEpoch } = useRecoilValue(
    rCircleEpochsStatus(circleId ?? -1)
  );

  const closestEpoch = currentEpoch ?? nextEpoch;

  const epochTiming =
    closestEpoch !== undefined
      ? calculateEpochTimings(closestEpoch)
      : undefined;

  const currentEpochNumber = previousEpoch
    ? String(previousEpoch.number + 1)
    : '1';

  let timingMessage = 'Epoch not Scheduled';
  let longTimingMessage = 'Next Epoch not Scheduled';

  if (epochTiming && !epochTiming.hasBegun) {
    timingMessage = `Epoch Begins in ${timingToLeastUnit(
      epochTiming.timeUntilStart
    )}`;
    longTimingMessage = `Epoch ${currentEpochNumber} Begins in ${timingToLeastUnit(
      epochTiming.timeUntilStart
    )}`;
  }
  if (epochTiming && epochTiming.hasBegun) {
    timingMessage = `Epoch ends in ${timingToLeastUnit(
      epochTiming.timeUntilEnd
    )}`;
    longTimingMessage = `Epoch ${currentEpochNumber} Ends in ${timingToLeastUnit(
      epochTiming.timeUntilEnd
    )}`;
  }

  return {
    circleId,
    pastEpochs,
    previousEpoch,
    currentEpoch,
    nextEpoch,
    epochIsActive: !!currentEpoch,
    timingMessage,
    longTimingMessage,
  };
};
