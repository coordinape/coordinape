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
  const { fetchCircle } = useApiBase();

  const updateCircle = useRecoilLoadCatch(
    () => async (params: ValueTypes['UpdateCircleInput']) => {
      await mutations.updateCircle(params);
      await fetchCircle({ circleId });
    },
    [circleId]
  );

  const updateCircleLogo = useRecoilLoadCatch(
    () => async (newLogo: File) => {
      const image_data_base64 = await fileToBase64(newLogo);
      await mutations.updateCircleLogo(circleId, image_data_base64);
      await fetchCircle({ circleId });
    },
    [circleId]
  );

  const createEpoch = useRecoilLoadCatch(
    () => async (params: Omit<ValueTypes['CreateEpochInput'], 'circle_id'>) => {
      await mutations.createEpoch({ circle_id: circleId, ...params });
      await fetchCircle({ circleId });
    },
    [circleId],
    { hideLoading: false }
  );

  const updateEpoch = useRecoilLoadCatch(
    () => async (epochId: number, params: UpdateCreateEpochParam) => {
      await mutations.updateEpoch(circleId, epochId, params);
      await fetchCircle({ circleId });
    },
    [circleId],
    { hideLoading: false }
  );

  const deleteEpoch = useRecoilLoadCatch(
    () => async (epochId: number) => {
      await mutations.deleteEpoch(circleId, epochId);
      await fetchCircle({ circleId });
    },
    [circleId]
  );

  const updateUser = useRecoilLoadCatch(
    () => async (userAddress: string, params: UpdateUsersParam) => {
      await mutations.adminUpdateUser(circleId, userAddress, params);
      await fetchCircle({ circleId });
    },
    [circleId]
  );

  const createUser = useRecoilLoadCatch(
    () => async (params: PostUsersParam) => {
      await mutations.createUser(circleId, params);
      await fetchCircle({ circleId });
    },
    [circleId]
  );

  const deleteUser = useRecoilLoadCatch(
    () => async (userAddress: string) => {
      await mutations.deleteUser(circleId, userAddress);
      await fetchCircle({ circleId });
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
    () =>
      async (
        epoch?: number,
        epochId?: number,
        formGiftAmount?: number,
        giftTokenSymbol?: string
      ) => {
        return await mutations.allocationCsv(
          circleId,
          epoch,
          epochId,
          formGiftAmount,
          giftTokenSymbol
        );
      },
    [circleId]
  );

  const restoreCoordinape = useRecoilLoadCatch(
    () => async (circleId: number) => {
      await mutations.restoreCoordinapeUser(circleId);
      await fetchCircle({ circleId });
    }
  );

  return {
    createEpoch,
    createUser,
    deleteEpoch,
    deleteUser,
    downloadCSV,
    getDiscordWebhook,
    restoreCoordinape,
    updateCircle,
    updateCircleLogo,
    updateEpoch,
    updateUser,
  };
};
