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
