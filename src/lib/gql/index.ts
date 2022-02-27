import { Thunder, apiFetch, ValueTypes, $ } from './zeusUser';

const makeQuery = (url: string, getToken: () => string) =>
  Thunder(
    apiFetch([
      url,
      {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + getToken(),
        },
      },
    ])
  );

export function getGql(url: string, getToken: () => string) {
  const updateProfile = async (
    id: number,
    profile: ValueTypes['profiles_set_input']
  ) =>
    makeQuery(url, getToken)('mutation')({
      update_profiles_by_pk: [
        { set: profile, pk_columns: { id } },
        { id: true, admin_view: true },
      ],
    });

  const updateProfileAvatar = async (image_data_base64: string) =>
    makeQuery(url, getToken)('mutation')(
      {
        upload_profile_avatar: [
          { object: { image_data_base64: $`image_data_base64` } },
          { id: true },
        ],
      },
      {
        variables: {
          image_data_base64,
        },
      }
    );

  const updateProfileBackground = async (image_data_base64: string) =>
    makeQuery(url, getToken)('mutation')(
      {
        upload_profile_background: [
          { object: { image_data_base64: $`image_data_base64` } },
          { id: true },
        ],
      },
      {
        variables: {
          image_data_base64,
        },
      }
    );

  const updateCircleLogo = async (
    circleId: number,
    image_data_base64: string
  ) =>
    makeQuery(url, getToken)('mutation')(
      {
        upload_circle_logo: [
          {
            object: {
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

  return {
    updateProfile,
    updateProfileAvatar,
    updateProfileBackground,
    updateCircleLogo,
  };
}

/*
example usage in app code:

import { REACT_APP_HASURA_URL } from 'config/env';
import { getAuthToken } from 'services/api';
import { getGql } from 'lib/gql';

// TODO: this doesnt actually work cuz getAuthToken is an optional
// callers need to unwrap the optional and pass in to this

const api = getGql(REACT_APP_HASURA_URL, getAuthToken);
await api.updateProfile();
*/
