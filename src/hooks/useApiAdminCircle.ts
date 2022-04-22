import * as mutations from 'lib/gql/mutations';
import * as queries from 'lib/gql/queries';

import { fileToBase64 } from '../lib/base64';
import { ValueTypes } from '../lib/gql/__generated__/zeus';
import { useApiBase } from 'hooks';

import { useRecoilLoadCatch } from './useRecoilLoadCatch';

import {
  UpdateUsersParam,
  PostUsersParam,
  UpdateCreateEpochParam,
} from 'types';

export const useApiAdminCircle = (circleId: number) => {
  const { fetchManifest } = useApiBase();

  const updateCircle = useRecoilLoadCatch(
    () => async (params: ValueTypes['UpdateCircleInput']) => {
      await mutations.updateCircle(params);
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
    () => async (params: Omit<ValueTypes['CreateEpochInput'], 'circle_id'>) => {
      await mutations.createEpoch({ circle_id: circleId, ...params });
      await fetchManifest();
    },
    [circleId],
    { hideLoading: true }
  );

  const updateEpoch = useRecoilLoadCatch(
    () => async (epochId: number, params: UpdateCreateEpochParam) => {
      await mutations.updateEpoch(circleId, epochId, params);
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
      await mutations.deleteUser(circleId, userAddress);
      await fetchManifest();
    },
    [circleId]
  );

  const getDiscordWebhook = useRecoilLoadCatch(
    () => async () => {
      return (await queries.getDiscordWebhook(circleId)) || '';
    },
    [circleId]
  );

  const downloadCSV = useRecoilLoadCatch(
    () => async (epoch: number) => {
      return await mutations.allocationCsv(circleId, epoch);
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
