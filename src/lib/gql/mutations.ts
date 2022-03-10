import { $, ValueTypes } from './__generated__/zeusUser';
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
