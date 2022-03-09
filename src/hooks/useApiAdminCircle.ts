import { HASURA_ENABLED, REACT_APP_HASURA_URL } from '../config/env';
import { fileToBase64 } from '../lib/base64';
import { getUserClient } from '../lib/gql/userClient';
import { useApiBase } from 'hooks';
import { getApiService, getAuthToken } from 'services/api';

import { useRecoilLoadCatch } from './useRecoilLoadCatch';

import {
  PutCirclesParam,
  UpdateUsersParam,
  PostUsersParam,
  UpdateCreateEpochParam,
} from 'types';

const api = getUserClient(REACT_APP_HASURA_URL, () => {
  const token = getAuthToken();
  if (token) {
    return token;
  } else {
    // TODO: ideally would figure out a better way to handle this, in a uniform way
    return '';
  }
});

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
      if (HASURA_ENABLED) {
        await api.updateCircleLogo(circleId, image_data_base64);
      } else {
        await getApiService().uploadCircleLogo(circleId, newLogo);
      }
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
