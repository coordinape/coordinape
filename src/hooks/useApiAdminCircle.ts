import { useApiBase } from 'hooks';
import { getApiService } from 'services/api';

import { useRecoilLoadCatch } from './useRecoilLoadCatch';

import {
  PutCirclesParam,
  UpdateUsersParam,
  PostUsersParam,
  UpdateCreateEpochParam,
} from 'types';

export const useApiAdminCircle = (circleId: number) => {
  const { fetchManifest } = useApiBase();

  const updateCircle = useRecoilLoadCatch(
    () => async (params: PutCirclesParam) => {
      await getApiService().putCircles(circleId, params);
      await fetchManifest();
    },
    [circleId]
  );

  const updateCircleLogo = useRecoilLoadCatch(
    () => async (newAvatar: File) => {
      await getApiService().uploadCircleLogo(circleId, newAvatar);
      await fetchManifest();
    },
    [circleId]
  );

  const createEpoch = useRecoilLoadCatch(
    () => async (params: UpdateCreateEpochParam) => {
      await getApiService().createEpoch(circleId, params);
      await fetchManifest();
    },
    [circleId],
    { hideLoading: true }
  );

  const updateEpoch = useRecoilLoadCatch(
    () => async (epochId: number, params: UpdateCreateEpochParam) => {
      await getApiService().updateEpoch(circleId, epochId, params);
      await fetchManifest();
    },
    [circleId],
    { hideLoading: true }
  );

  const deleteEpoch = useRecoilLoadCatch(
    () => async (epochId: number) => {
      await getApiService().deleteEpoch(circleId, epochId);
      await fetchManifest();
    },
    [circleId]
  );

  const updateUser = useRecoilLoadCatch(
    () => async (userAddress: string, params: UpdateUsersParam) => {
      await getApiService().updateUser(circleId, userAddress, params);
      await fetchManifest();
    },
    [circleId]
  );

  const createUser = useRecoilLoadCatch(
    () => async (params: PostUsersParam) => {
      await getApiService().createUser(circleId, params);
      await fetchManifest();
    },
    [circleId]
  );

  const deleteUser = useRecoilLoadCatch(
    () => async (userAddress: string) => {
      await getApiService().deleteUser(circleId, userAddress);
      await fetchManifest();
    },
    [circleId]
  );

  const getDiscordWebhook = useRecoilLoadCatch(
    () => async () => {
      return await getApiService().getDiscordWebhook(circleId);
    },
    [circleId]
  );

  const downloadCSV = useRecoilLoadCatch(
    () => async (epoch: number) => {
      return await getApiService().downloadCSV(circleId, epoch);
    },
    [circleId]
  );

  return {
    updateCircle,
    updateCircleLogo,
    createEpoch,
    updateEpoch,
    deleteEpoch,
    updateUser,
    createUser,
    deleteUser,
    getDiscordWebhook,
    downloadCSV,
  };
};
