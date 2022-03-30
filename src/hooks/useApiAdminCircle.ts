import * as mutations from 'lib/gql/mutations';

import { fileToBase64 } from '../lib/base64';
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
    () => async (newLogo: File) => {
      const image_data_base64 = await fileToBase64(newLogo);
      await mutations.updateCircleLogo(circleId, image_data_base64);
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
      await mutations.deleteEpoch(circleId, epochId);
      await fetchManifest();
    },
    [circleId]
  );

  const updateUser = useRecoilLoadCatch(
    () => async (userAddress: string, params: UpdateUsersParam) => {
      await mutations.adminUpdateUser(circleId, userAddress, params);
      await fetchManifest();
    },
    [circleId]
  );

  const createUser = useRecoilLoadCatch(
    () => async (params: PostUsersParam) => {
      await mutations.createUser(circleId, params);
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
