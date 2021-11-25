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
  const { fetchCircle } = useApiBase();

  const updateCircle = useRecoilLoadCatch(
    () => async (params: PutCirclesParam) => {
      await getApiService().putCircles(circleId, params);
      await fetchCircle({ circleId });
    },
    [circleId]
  );

  const updateCircleLogo = useRecoilLoadCatch(
    () => async (newAvatar: File) => {
      await getApiService().uploadCircleLogo(circleId, newAvatar);
      await fetchCircle({ circleId });
    },
    [circleId]
  );

  const createEpoch = useRecoilLoadCatch(
    () => async (params: UpdateCreateEpochParam) => {
      await getApiService().createEpoch(circleId, params);
      await fetchCircle({ circleId });
    },
    [circleId],
    { hideLoading: true }
  );

  const updateEpoch = useRecoilLoadCatch(
    () => async (epochId: number, params: UpdateCreateEpochParam) => {
      await getApiService().updateEpoch(circleId, epochId, params);
      await fetchCircle({ circleId });
    },
    [circleId],
    { hideLoading: true }
  );

  const deleteEpoch = useRecoilLoadCatch(
    () => async (epochId: number) => {
      await getApiService().deleteEpoch(circleId, epochId);
      await fetchCircle({ circleId });
    },
    [circleId]
  );

  const updateUser = useRecoilLoadCatch(
    () => async (userAddress: string, params: UpdateUsersParam) => {
      await getApiService().updateUser(circleId, userAddress, params);
      await fetchCircle({ circleId });
    },
    [circleId]
  );

  const createUser = useRecoilLoadCatch(
    () => async (params: PostUsersParam) => {
      await getApiService().createUser(circleId, params);
      await fetchCircle({ circleId });
    },
    [circleId]
  );

  const deleteUser = useRecoilLoadCatch(
    () => async (userAddress: string) => {
      await getApiService().deleteUser(circleId, userAddress);
      await fetchCircle({ circleId });
    },
    [circleId]
  );

  const getDiscordWebhook = useRecoilLoadCatch(
    () => async () => {
      return await getApiService().getDiscordWebhook(circleId);
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
  };
};
