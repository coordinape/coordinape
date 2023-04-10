import { client } from 'lib/gql/client';
import * as mutations from 'lib/gql/mutations';
import { useQueryClient } from 'react-query';

import { fileToBase64 } from '../lib/base64';
import { ValueTypes } from '../lib/gql/__generated__/zeus';
import { useFetchCircle } from 'hooks/legacyApi';
import { QUERY_KEY_GET_MEMBERS_PAGE_DATA } from 'pages/MembersPage/getMembersPageData';

import { useRecoilLoadCatch } from './useRecoilLoadCatch';

const queryDiscordWebhook = async (circleId: number) => {
  const { circle_private } = await client.query(
    {
      circle_private: [
        { where: { circle_id: { _eq: circleId } } },
        { discord_webhook: true },
      ],
    },
    { operationName: 'queryDiscordWebhook' }
  );
  return circle_private.pop()?.discord_webhook;
};

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
  originalAddress: string,
  params: UpdateUsersParam
) => {
  const new_address =
    params.address.toLowerCase() != originalAddress.toLowerCase()
      ? params.address.toLowerCase()
      : undefined;

  // const startingTokens = params.starting_tokens
  const { adminUpdateUser } = await client.mutate(
    {
      adminUpdateUser: [
        {
          payload: {
            circle_id: circleId,
            address: originalAddress,
            new_address,
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
  const fetchCircle = useFetchCircle();
  const queryClient = useQueryClient();

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
    () => async (params: ValueTypes['CreateEpochInput']['params']) => {
      params.time_zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      await mutations.createEpoch({ circle_id: circleId, params });
      await fetchCircle({ circleId });
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
        await fetchCircle({ circleId });
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
      await adminUpdateUser(circleId, userAddress, params);
      await fetchCircle({ circleId });
    },
    [circleId]
  );

  const deleteUser = useRecoilLoadCatch(
    () => async (userAddress: string) => {
      await mutations.deleteUser(circleId, userAddress);
      await queryClient.invalidateQueries(QUERY_KEY_GET_MEMBERS_PAGE_DATA);

      // probably unnecessary now
      await fetchCircle({ circleId });
    },
    [circleId]
  );

  const getDiscordWebhook = useRecoilLoadCatch(
    () => async () => {
      return (await queryDiscordWebhook(circleId)) || '';
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
    deleteEpoch,
    deleteUser,
    downloadCSV,
    getDiscordWebhook,
    restoreCoordinape,
    updateCircle,
    updateCircleLogo,
    updateEpoch,
    updateActiveRepeatingEpoch,
    updateUser,
  };
};
