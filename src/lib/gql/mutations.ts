import { CreateCircleParam, IApiCircle, UpdateUsersParam } from '../../types';

import { $, ValueTypes } from './__generated__/zeus';
import { client } from './client';

export const updateProfile = async (
  id: number,
  profile: ValueTypes['profiles_set_input']
) =>
  client.mutate({
    update_profiles_by_pk: [
      { set: profile, pk_columns: { id } },
      { id: true, admin_view: true },
    ],
  });

export const updateProfileAvatar = async (image_data_base64: string) =>
  client.mutate(
    {
      uploadProfileAvatar: [
        { payload: { image_data_base64: $`image_data_base64` } },
        { id: true },
      ],
    },
    {
      variables: {
        image_data_base64,
      },
    }
  );

export const updateProfileBackground = async (image_data_base64: string) =>
  client.mutate(
    {
      uploadProfileBackground: [
        { payload: { image_data_base64: $`image_data_base64` } },
        { id: true },
      ],
    },
    {
      variables: {
        image_data_base64,
      },
    }
  );

export const updateCircleLogo = async (
  circleId: number,
  image_data_base64: string
) =>
  client.mutate(
    {
      uploadCircleLogo: [
        {
          payload: {
            image_data_base64: $`image_data_base64`,
            circle_id: $`circleId`,
          },
        },
        { id: true },
      ],
    },
    {
      variables: {
        circleId: circleId,
        image_data_base64,
      },
    }
  );

export const createCircleIntegration = async (
  circleId: number,
  type: string,
  name: string,
  data: any
) =>
  client.mutate(
    {
      insert_circle_integrations_one: [
        {
          object: {
            circle_id: circleId,
            type,
            name,
            data: $`data`,
          },
        },
        { id: true },
      ],
    },
    { variables: { data } }
  );

export const deleteCircleIntegration = async (id: number) =>
  client.mutate({
    delete_circle_integrations_by_pk: [{ id }, { id: true }],
  });

export const logout = async (): Promise<boolean> => {
  const { logoutUser } = await client.mutate({
    logoutUser: {
      id: true,
    },
  });
  if (logoutUser?.id) {
    return true;
  }
  return false;
};

export const createCircle = async (
  params: CreateCircleParam
): Promise<IApiCircle> => {
  const { createCircle } = await client.mutate({
    createCircle: [
      {
        payload: params,
      },
      {
        circle: {
          id: true,
          name: true,
          logo: true,
          default_opt_in: true,
          is_verified: true,
          alloc_text: true,
          team_sel_text: true,
          token_name: true,
          vouching: true,
          min_vouches: true,
          nomination_days_limit: true,
          vouching_text: true,
          only_giver_vouch: true,
          team_selection: true,
          created_at: true,
          updated_at: true,
          protocol_id: true,
          organization: {
            id: true,
            name: true,
            created_at: true,
            updated_at: true,
          },
          auto_opt_out: true,
        },
      },
    ],
  });
  if (!createCircle) {
    throw 'unable to create circle';
  }
  if (!createCircle.circle.organization) {
    throw 'circle created but protocol / organization not found after creation';
  }
  return {
    ...createCircle.circle,
    protocol: createCircle.circle.organization,
  };
};

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
  const { adminUpdateUser } = await client.mutate({
    adminUpdateUser: [
      {
        payload: {
          circle_id: circleId,
          name: params.name,
          address: originalAddress,
          new_address,
          fixed_non_receiver: params.fixed_non_receiver,
          role: params.role,
          // starting_tokens: params.starting_tokens,
          non_giver: params.non_giver,
          non_receiver: params.fixed_non_receiver,
        },
      },
      {
        id: true,
      },
    ],
  });
  return adminUpdateUser;
};
