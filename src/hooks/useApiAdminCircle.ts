/**
 * DEPRECATED -- do not add new methods to this file.
 * Just use Zeus and react-query directly in components.
 */

import { client } from 'lib/gql/client';
import * as mutations from 'lib/gql/mutations';
import { useQueryClient } from 'react-query';

import { fileToBase64 } from '../lib/base64';
import { ValueTypes } from '../lib/gql/__generated__/zeus';
import { QUERY_KEY_GET_MEMBERS_PAGE_DATA } from 'pages/MembersPage/getMembersPageData';

import { useRecoilLoadCatch } from './useRecoilLoadCatch';

interface UpdateUsersParam {
  address: string;
  non_giver?: boolean;
  fixed_non_receiver?: boolean;
  non_receiver?: boolean;
  role?: number;
  starting_tokens?: number;
  fixed_payment_amount?: number;
}

export const adminUpdateUser = async (
  circleId: number,
  profileId: number,
  params: UpdateUsersParam
) => {
  // const startingTokens = params.starting_tokens
  const { adminUpdateUser } = await client.mutate(
    {
      adminUpdateUser: [
        {
          payload: {
            circle_id: circleId,
            profile_id: profileId,
            fixed_non_receiver: params.fixed_non_receiver,
            role: params.role,
            starting_tokens: params.starting_tokens,
            non_giver: params.non_giver,
            non_receiver: params.non_receiver || params.fixed_non_receiver,
            fixed_payment_amount: params.fixed_payment_amount,
          },
        },
        { id: true },
      ],
    },
    { operationName: 'adminUpdateUser' }
  );
  return adminUpdateUser;
};

export const useApiAdminCircle = (circleId: number) => {
  const queryClient = useQueryClient();

  const updateCircleLogo = useRecoilLoadCatch(
    () => async (newLogo: File) => {
      const image_data_base64 = await fileToBase64(newLogo);
      await mutations.updateCircleLogo(circleId, image_data_base64);
    },
    [circleId]
  );

  const createEpoch = useRecoilLoadCatch(
    () => async (params: ValueTypes['CreateEpochInput']['params']) => {
      params.time_zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      await mutations.createEpoch({ circle_id: circleId, params });
    },
    [circleId],
    { hideLoading: false }
  );

  const updateEpoch = useRecoilLoadCatch(
    () =>
      async (
        epochId: number,
        {
          params,
          description,
        }: {
          params: ValueTypes['UpdateEpochInput']['params'];
          description?: string;
        }
      ) => {
        if (params)
          params.time_zone = Intl.DateTimeFormat().resolvedOptions().timeZone;

        await mutations.updateEpoch({
          params,
          id: epochId,
          circle_id: circleId,
          description,
        });
      },
    [circleId],
    { hideLoading: false }
  );

  const updateActiveRepeatingEpoch = useRecoilLoadCatch(
    () =>
      async (
        epochId: number,
        params: {
          current: ValueTypes['UpdateEpochInput']['params'];
          next: ValueTypes['CreateEpochInput']['params'];
        }
      ) => {
        await mutations.updateActiveRepeatingEpoch(circleId, epochId, params);
      },
    [circleId],
    { hideLoading: false }
  );

  const deleteEpoch = useRecoilLoadCatch(
    () => async (epochId: number) => {
      await mutations.deleteEpoch(circleId, epochId);
    },
    [circleId]
  );

  const updateUser = useRecoilLoadCatch(
    () => async (profileId: number, params: UpdateUsersParam) => {
      await adminUpdateUser(circleId, profileId, params);
    },
    [circleId]
  );

  const deleteUser = useRecoilLoadCatch(
    () => async (profileId: number) => {
      await mutations.deleteUser(circleId, profileId);
      await queryClient.invalidateQueries(QUERY_KEY_GET_MEMBERS_PAGE_DATA);
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
    }
  );

  return {
    createEpoch,
    deleteEpoch,
    deleteUser,
    downloadCSV,
    restoreCoordinape,
    updateCircleLogo,
    updateEpoch,
    updateActiveRepeatingEpoch,
    updateUser,
  };
};
