import { useHistory } from 'react-router';
import { useRecoilState, useRecoilValue, useRecoilCallback } from 'recoil';

import { getSelfIdProfiles } from '../utils/selfIdHelpers';
import { useAsyncLoadCatch } from 'hooks';
import {
  rSelectedCircleId,
  rPastGiftsRaw,
  rPendingGiftsRaw,
  rUsersMapRaw,
  rEpochsRaw,
  rAvailableTeammates,
  rSelectedCircle,
  rCircleEpochsStatus,
  rNomineesRaw,
  rSelfIdProfiles,
} from 'recoilState';
import { getHistoryPath, getAllocationPath } from 'routes/paths';
import { getApiService } from 'services/api';
import {
  updaterMergeToIdMap,
  updaterMergeToAddressMap,
} from 'utils/recoilHelpers';

import { useRecoilFetcher } from './useRecoilFetcher';

export const useCircle = () => {
  const history = useHistory();
  const callWithLoadCatch = useAsyncLoadCatch();
  const api = getApiService();

  const [selectedCircleId, setSelectedCircleId] =
    useRecoilState(rSelectedCircleId);
  const availableTeammates = useRecoilValue(rAvailableTeammates);
  const selectedCircle = useRecoilValue(rSelectedCircle);

  // Okay, update:
  // selected user first visit
  // selected user has team
  // if switch at '/' or any allocation path then nav to least done
  const triggerDefaultNavigation = useRecoilCallback(
    ({ snapshot }) =>
      async () => {
        const circleId = await snapshot.getPromise(rSelectedCircleId);
        const { currentEpoch } = await snapshot.getPromise(
          rCircleEpochsStatus(circleId ?? -1)
        );
        if (history.location.pathname === '/') {
          if (currentEpoch) {
            history.push(getAllocationPath());
          } else {
            history.push(getHistoryPath());
          }
        }
      }
  );

  const fetchUsersWith = useRecoilFetcher(
    'rUsersMapRaw',
    rUsersMapRaw,
    updaterMergeToIdMap
  );
  const fetchGiftsWith = useRecoilFetcher(
    'rPastGiftsRaw',
    rPastGiftsRaw,
    updaterMergeToIdMap
  );
  const fetchPendingGiftsWith = useRecoilFetcher(
    'rPendingGiftsRaw',
    rPendingGiftsRaw,
    updaterMergeToIdMap
  );
  const fetchEpochsWith = useRecoilFetcher(
    'rEpochsRaw',
    rEpochsRaw,
    updaterMergeToIdMap
  );
  const fetchNomineesWith = useRecoilFetcher(
    'rNomineesRaw',
    rNomineesRaw,
    updaterMergeToIdMap
  );
  const fetchSelfIdProfilesWith = useRecoilFetcher(
    'rSelfIdProfiles',
    rSelfIdProfiles,
    updaterMergeToAddressMap
  );

  const fetchSelfIdProfiles = async (addresses: string[]) => {
    const [commit, result] = await fetchSelfIdProfilesWith(getSelfIdProfiles, [
      addresses,
    ]);
    commit();
    return result;
  };

  const selectAndFetchCircle = async (circleId: number) =>
    callWithLoadCatch(async () => {
      const results = await Promise.all([
        await fetchUsersWith(api.getUsers, [
          { circle_id: circleId, deleted_users: true },
        ]),
        await fetchEpochsWith(api.getEpochs, [circleId]),
        await fetchGiftsWith(api.getTokenGifts, [{ circle_id: circleId }]),
        await fetchPendingGiftsWith(api.getPendingTokenGifts, [
          { circle_id: circleId },
        ]),
        await fetchNomineesWith(api.getNominees, [selectedCircleId]),
      ]);

      results.forEach(([commit]) => commit());
      setSelectedCircleId(circleId);
      triggerDefaultNavigation();

      // Allow selfids to be filled in after everything else
      const addresses = results[0][1]?.map(p => p.address);
      if (addresses) {
        fetchSelfIdProfiles(addresses);
      }
    });

  return {
    availableTeammates,
    selectedCircleId,
    selectedCircle,
    selectAndFetchCircle,
    setSelectedCircleId,
  };
};
