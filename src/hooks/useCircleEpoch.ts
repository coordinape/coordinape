import { useRecoilValue } from 'recoil';

import { rCircleEpochsStatus, rSelectedCircleId } from 'recoilState';

import { IEpoch } from 'types';

// TODO: this could be a recoil state.
export const useCircleEpoch = (
  circleId: number | undefined
): {
  circleId: number | undefined;
  epochs: IEpoch[];
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
    epochs,
    pastEpochs,
    previousEpoch,
    currentEpoch,
    nextEpoch,
    futureEpochs,
  } = useRecoilValue(rCircleEpochsStatus(circleId ?? -1));

  const closest = currentEpoch ?? nextEpoch;

  const currentEpochNumber = currentEpoch?.number
    ? String(currentEpoch.number)
    : previousEpoch?.number
    ? String(previousEpoch.number + 1)
    : '1';

  let timingMessage = 'Epoch not Scheduled';
  let longTimingMessage = 'Next Epoch not Scheduled';

  if (closest && !closest.started) {
    timingMessage = `Epoch Begins in ${closest.labelUntilStart}`;
    longTimingMessage = `Epoch ${currentEpochNumber} Begins in ${closest.labelUntilStart}`;
  }
  if (closest && closest.started) {
    timingMessage = `Epoch ends in ${closest.labelUntilEnd}`;
    longTimingMessage = `Epoch ${currentEpochNumber} Ends in ${closest.labelUntilEnd}`;
  }

  return {
    circleId,
    epochs,
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
