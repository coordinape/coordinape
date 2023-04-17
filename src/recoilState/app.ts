// at 5k elements for filter-map-slice itiriri is more performant

import debug from 'debug';
import iti from 'itiriri';
import { DateTime } from 'luxon';
import { atom, selector, selectorFamily, useRecoilValue } from 'recoil';

import { extraProfile } from 'utils/modelExtenders';
import { neverEndingPromise } from 'utils/recoil';

import { rManifest, rFullCircle } from './db';
import { queryProfile } from './queries';

import { IEpoch } from 'types';

const log = debug('recoil');

export const rSelectedCircleIdSource = atom<number | undefined>({
  key: 'rSelectedCircleIdSource',
  default: undefined,
});

// Suspend unless it has a value.
// This is set by fetchCircle in hooks/legacyApi
export const rSelectedCircleId = selector({
  key: 'rSelectedCircleId',
  get: async ({ get }) => {
    const id = get(rSelectedCircleIdSource);
    if (id === undefined) {
      log('rSelectedCircleId: neverEndingPromise...');
      return neverEndingPromise<number>();
    }
    return id;
  },
});

const rProfile = selectorFamily({
  key: 'rProfile',
  get: (address: string) => async () => {
    const profile = await queryProfile(address);
    return extraProfile(profile);
  },
});

const rCircleEpochs = selectorFamily<IEpoch[], number>({
  key: 'rCircleEpochs',
  get:
    (circleId: number) =>
    ({ get }) => {
      let lastNumber = 1;
      const epochsWithNumber = [] as IEpoch[];

      iti(get(rFullCircle).epochsMap.values())
        .filter(e => e.circle_id === circleId)
        .sort((a, b) => +new Date(a.start_date) - +new Date(b.start_date))
        .forEach(epoch => {
          lastNumber = epoch.number ?? lastNumber + 1;
          epochsWithNumber.push({ ...epoch, number: lastNumber });
        });

      return epochsWithNumber;
    },
});

export const rCircleEpochsStatus = selectorFamily({
  key: 'rCircleEpochsStatus',
  get:
    (circleId: number) =>
    ({ get }) => {
      const epochs = get(rCircleEpochs(circleId));
      const pastEpochs = epochs.filter(
        epoch => +new Date(epoch.end_date) - +new Date() <= 0
      );
      const futureEpochs = epochs.filter(
        epoch => +new Date(epoch.start_date) - +new Date() >= 0
      );
      const previousEpoch =
        pastEpochs.length > 0 ? pastEpochs[pastEpochs.length - 1] : undefined;
      const nextEpoch = futureEpochs.length > 0 ? futureEpochs[0] : undefined;
      const previousEpochEndedOn =
        previousEpoch &&
        previousEpoch.endDate
          .minus({ seconds: 1 })
          .toLocal()
          .toLocaleString(DateTime.DATE_MED);

      const currentEpoch = epochs.find(
        epoch =>
          +new Date(epoch.start_date) - +new Date() <= 0 &&
          +new Date(epoch.end_date) - +new Date() >= 0
      );

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
        epochs,
        pastEpochs,
        previousEpoch,
        currentEpoch,
        nextEpoch,
        futureEpochs,
        previousEpochEndedOn,
        epochIsActive: !!currentEpoch,
        timingMessage,
        longTimingMessage,
      };
    },
});

// DEPRECATED
export const useMyProfile = () => useRecoilValue(rManifest).myProfile;

// DEPRECATED
export const useProfile = (address: string) =>
  useRecoilValue(rProfile(address));
