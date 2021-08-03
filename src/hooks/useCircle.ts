import { useHistory } from 'react-router';
import { useRecoilState, useRecoilValue, useRecoilCallback } from 'recoil';

import { useAsyncLoadCatch } from 'hooks';
import {
  rSelectedCircleId,
  rPastGiftsRaw,
  rPendingGiftsRaw,
  rUsersMap,
  rEpochsRaw,
  rAvailableTeammates,
  rSelectedCircle,
  rCircleEpochsStatus,
  rNomineesRaw,
} from 'recoilState';
import { getHistoryPath, getAllocationPath } from 'routes/paths';
import { getApiService } from 'services/api';
import { updaterMergeArrayToIdMap } from 'utils/recoilHelpers';

import { useRecoilFetcher } from './useRecoilFetcher';

import {
  IApiTokenGift,
  IUser,
  IApiEpoch,
  ICircle,
  IApiUserProfile,
  IApiNominee,
} from 'types';

export const useCircle = (): {
  availableTeammates: IUser[];
  selectedCircle: ICircle | undefined;
  selectedCircleId: number | undefined;
  clearSelectedCircle: () => void;
  selectAndFetchCircle: (circleId: number) => Promise<void>;
  fetchUsersForCircle: () => Promise<IApiUserProfile[]>;
  fetchGiftsForCircle: () => Promise<IApiTokenGift[]>;
  fetchPendingGiftsForCircle: () => Promise<IApiTokenGift[]>;
  fetchEpochsForCircle: () => Promise<IApiEpoch[]>;
  fetchNomineesForCircle: () => Promise<IApiNominee[]>;
} => {
  const history = useHistory();
  const callWithLoadCatch = useAsyncLoadCatch();
  const api = getApiService();

  const [selectedCircleId, setSelectedCircleId] = useRecoilState(
    rSelectedCircleId
  );
  const availableTeammates = useRecoilValue(rAvailableTeammates);
  const selectedCircle = useRecoilValue(rSelectedCircle);

  // Okay, update:
  // selected user first visit
  // selected user has team
  // if switch at '/' or any allocation path then nav to least done
  const triggerDefaultNavigation = useRecoilCallback(
    ({ snapshot }) => async () => {
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

  const fetchUsers = useRecoilFetcher(
    'rUsersMap',
    rUsersMap,
    updaterMergeArrayToIdMap
  );
  const fetchGifts = useRecoilFetcher(
    'rPastGiftsRaw',
    rPastGiftsRaw,
    updaterMergeArrayToIdMap
  );
  const fetchPendingGifts = useRecoilFetcher(
    'rPendingGiftsRaw',
    rPendingGiftsRaw,
    updaterMergeArrayToIdMap
  );
  const fetchEpochs = useRecoilFetcher(
    'rEpochsRaw',
    rEpochsRaw,
    updaterMergeArrayToIdMap
  );
  const fetchNominees = useRecoilFetcher(
    'rNomineesRaw',
    rNomineesRaw,
    updaterMergeArrayToIdMap
  );

  const fetchUsersForCircle = async (): Promise<IUser[]> => {
    const [commit, result] = await fetchUsers(api.getUsers, [
      undefined,
      selectedCircleId,
      undefined,
      true,
    ]);
    commit();
    return result as IApiUserProfile[];
  };

  const fetchGiftsForCircle = async (): Promise<IApiTokenGift[]> => {
    const [commit, result] = await fetchGifts(api.getTokenGifts, [
      selectedCircleId,
    ]);
    commit();
    return result as IApiTokenGift[];
  };

  const fetchPendingGiftsForCircle = async (): Promise<IApiTokenGift[]> => {
    const [commit, result] = await fetchPendingGifts(api.getPendingTokenGifts, [
      selectedCircleId,
    ]);
    commit();
    return result as IApiTokenGift[];
  };

  const fetchEpochsForCircle = async (): Promise<IApiEpoch[]> => {
    const [commit, result] = await fetchEpochs(api.getEpochs, [
      selectedCircleId,
    ]);
    commit();
    return result as IApiEpoch[];
  };

  const fetchNomineesForCircle = async (): Promise<IApiNominee[]> => {
    const [commit, result] = await fetchNominees(api.getNominees, [
      selectedCircleId,
    ]);
    commit();
    return result as IApiNominee[];
  };

  const selectAndFetchCircle = async (circleId: number) =>
    callWithLoadCatch(async () => {
      const results = await Promise.all([
        await fetchUsers(api.getUsers, [
          { circle_id: circleId, deleted_users: true },
        ]),
        await fetchEpochs(api.getEpochs, [circleId]),
        await fetchGifts(api.getTokenGifts, [{ circle_id: circleId }]),
        await fetchPendingGifts(api.getPendingTokenGifts, [
          { circle_id: circleId },
        ]),
        await fetchNominees(api.getNominees, [selectedCircleId]),
      ]);

      results.forEach(([commit]) => commit());
      setSelectedCircleId(circleId);
      triggerDefaultNavigation();
    });

  const clearSelectedCircle = () => {
    setSelectedCircleId(undefined);
  };

  return {
    availableTeammates,
    selectedCircleId,
    selectedCircle,
    selectAndFetchCircle,
    clearSelectedCircle,
    fetchUsersForCircle,
    fetchGiftsForCircle,
    fetchPendingGiftsForCircle,
    fetchEpochsForCircle,
    fetchNomineesForCircle,
  };
};
