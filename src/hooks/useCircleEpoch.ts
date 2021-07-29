import { useRecoilValue } from 'recoil';

import { rCircleEpochsStatus, rSelectedCircleId } from 'recoilState';

import { IEpoch } from 'types';

// TODO: this could be a recoil state.
export const useCircleEpoch = (
  circleId: number | undefined
): {
  circleId: number | undefined;
  pastEpochs: IEpoch[];
  previousEpoch?: IEpoch;
  currentEpoch?: IEpoch;
  nextEpoch?: IEpoch;
  futureEpochs: IEpoch[];
  epochIsActive: boolean;
  timingMessage: string;
  longTimingMessage: string;
} => {
  // A fake circleId will just return nothing.
  const {
    pastEpochs,
    previousEpoch,
    currentEpoch,
    nextEpoch,
    futureEpochs,
  } = useRecoilValue(rCircleEpochsStatus(circleId ?? -1));

  const closest = currentEpoch ?? nextEpoch;

  const currentEpochNumber = previousEpoch
    ? String(previousEpoch.number ?? 0 + 1)
    : '1';

  let timingMessage = 'Epoch not Scheduled';
  let longTimingMessage = 'Next Epoch not Scheduled';

  if (closest && !closest.started) {
    timingMessage = `Epoch Begins in ${closest.labelTimeStart}`;
    longTimingMessage = `Epoch ${currentEpochNumber} Begins in ${closest.labelTimeStart}`;
  }
  if (closest && closest.started) {
    timingMessage = `Epoch ends in ${closest.labelUntilEnd}`;
    longTimingMessage = `Epoch ${currentEpochNumber} Ends in ${closest.labelUntilEnd}`;
  }

  return {
    circleId,
    pastEpochs,
    previousEpoch,
    currentEpoch,
    nextEpoch,
    futureEpochs,
    epochIsActive: !!currentEpoch,
    timingMessage,
    longTimingMessage,
  };
};

export const useSelectedCircleEpoch = () =>
  useCircleEpoch(useRecoilValue(rSelectedCircleId));
