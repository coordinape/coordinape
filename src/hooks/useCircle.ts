import { useRecoilState, useRecoilValue } from 'recoil';

import {
  rSelectedCircleId,
  rGiftsMap,
  rPendingGiftsMap,
  rUsersMap,
  rEpochsMap,
  rAvailableTeammates,
  rSelectedCircle,
} from 'recoilState';
import { getApiService } from 'services/api';
import { updaterMergeArrayToIdMap } from 'utils/recoilHelpers';

import { useRecoilFetcher } from './useRecoilFetcher';

import { ITokenGift, IUser, IEpoch, ICircle } from 'types';

export const useCircle = (): {
  availableTeammates: IUser[];
  selectedCircle: ICircle | undefined;
  selectCircle: (circleId: number) => Promise<void>;
  selectedCircleId: number | undefined;
  fetchUsersForCircle: () => Promise<IUser[]>;
  fetchGiftsForCircle: () => Promise<ITokenGift[]>;
  fetchPendingGiftsForCircle: () => Promise<ITokenGift[]>;
  fetchEpochsForCircle: () => Promise<IEpoch[]>;
} => {
  const api = getApiService();

  const [selectedCircleId, setSelectedCircleId] = useRecoilState(
    rSelectedCircleId
  );
  const availableTeammates = useRecoilValue(rAvailableTeammates);
  const selectedCircle = useRecoilValue(rSelectedCircle);

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

  const selectCircle = async (circleId: number) => {
    const results = await Promise.all([
      await fetchPendingGifts(api.getPendingTokenGifts, [
        undefined,
        undefined,
        circleId,
      ]),
      await fetchGifts(api.getTokenGifts, [{ circle_id: circleId }]),
      await fetchUsers(api.getUsers, [
        { circle_id: circleId, deleted_users: true },
      ]),
      await fetchEpochs(api.getEpochs, [circleId]),
    ]);

    results.forEach(([commit]) => commit());
    setSelectedCircleId(circleId);
  };

  return {
    availableTeammates,
    selectCircle,
    selectedCircleId,
    selectedCircle,
    fetchUsersForCircle,
    fetchGiftsForCircle,
    fetchPendingGiftsForCircle,
    fetchEpochsForCircle,
  };
};
