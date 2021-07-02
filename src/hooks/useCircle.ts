import { useHistory } from 'react-router';
import { useRecoilState, useRecoilValue, useRecoilCallback } from 'recoil';

import { useAsync } from 'hooks';
import {
  rSelectedCircleId,
  rGiftsMap,
  rPendingGiftsMap,
  rUsersMap,
  rEpochsMap,
  rAvailableTeammates,
  rSelectedCircle,
  rCircleEpochsStatus,
} from 'recoilState';
import { getHistoryPath, getAllocationPath } from 'routes/paths';
import { getApiService } from 'services/api';
import { updaterMergeArrayToIdMap } from 'utils/recoilHelpers';

import { useRecoilFetcher } from './useRecoilFetcher';

import { ITokenGift, IUser, IEpoch, ICircle } from 'types';

export const useCircle = (): {
  availableTeammates: IUser[];
  selectedCircle: ICircle | undefined;
  selectedCircleId: number | undefined;
  clearSelectedCircle: () => void;
  selectAndFetchCircle: (circleId: number) => Promise<void>;
  fetchUsersForCircle: () => Promise<IUser[]>;
  fetchGiftsForCircle: () => Promise<ITokenGift[]>;
  fetchPendingGiftsForCircle: () => Promise<ITokenGift[]>;
  fetchEpochsForCircle: () => Promise<IEpoch[]>;
} => {
  const history = useHistory();
  const asyncCall = useAsync();
  const api = getApiService();

  const [selectedCircleId, setSelectedCircleId] = useRecoilState(
    rSelectedCircleId
  );
  const availableTeammates = useRecoilValue(rAvailableTeammates);
  const selectedCircle = useRecoilValue(rSelectedCircle);

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
    'rGiftsMap',
    rGiftsMap,
    updaterMergeArrayToIdMap
  );
  const fetchPendingGifts = useRecoilFetcher(
    'rPendingGiftsMap',
    rPendingGiftsMap,
    updaterMergeArrayToIdMap
  );
  const fetchEpochs = useRecoilFetcher(
    'rEpochsMap',
    rEpochsMap,
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
    return result as IUser[];
  };

  const fetchGiftsForCircle = async (): Promise<ITokenGift[]> => {
    const [commit, result] = await fetchGifts(api.getTokenGifts, [
      selectedCircleId,
    ]);
    commit();
    return result as ITokenGift[];
  };

  const fetchPendingGiftsForCircle = async (): Promise<ITokenGift[]> => {
    const [commit, result] = await fetchPendingGifts(api.getPendingTokenGifts, [
      selectedCircleId,
    ]);
    commit();
    return result as ITokenGift[];
  };

  const fetchEpochsForCircle = async (): Promise<IEpoch[]> => {
    const [commit, result] = await fetchEpochs(api.getEpochs, [
      selectedCircleId,
    ]);
    commit();
    return result as IEpoch[];
  };

  const selectAndFetchCircle = async (circleId: number) => {
    const call = async () => {
      const results = await Promise.all([
        await fetchPendingGifts(api.getPendingTokenGifts, [
          { circle_id: circleId },
        ]),
        await fetchGifts(api.getTokenGifts, [{ circle_id: circleId }]),
        await fetchUsers(api.getUsers, [
          { circle_id: circleId, deleted_users: true },
        ]),
        await fetchEpochs(api.getEpochs, [circleId]),
      ]);

      results.forEach(([commit]) => commit());
      setSelectedCircleId(circleId);
      triggerDefaultNavigation();
    };
    return asyncCall(call(), true);
  };

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
  };
};
