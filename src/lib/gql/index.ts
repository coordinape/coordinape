import { useMemo } from 'react';

import { REACT_APP_HASURA_URL } from 'config/env';
import { getAuthToken } from 'services/api';

import { Thunder, apiFetch, ValueTypes, $ } from './zeusUser';

const makeQuery = (url: string, getToken: () => string | undefined) =>
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

export function getGql(url: string, getToken: () => string | undefined) {
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

  const createCircleIntegration = async (
    circleId: number,
    type: string,
    name: string,
    data: any
  ) =>
    makeQuery(url, getToken)('mutation')(
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

  const deleteCircleIntegration = async (id: number) =>
    makeQuery(url, getToken)('mutation')({
      delete_circle_integrations_by_pk: [{ id }, { id: true }],
    });

  return {
    updateProfile: updateProfile,
    updateProfileAvatar,
    updateProfileBackground,
    createCircleIntegration,
    deleteCircleIntegration,
  };
}

export function useApi() {
  return useMemo(() => getGql(REACT_APP_HASURA_URL, getAuthToken), []);
}
