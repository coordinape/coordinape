import { useMemo } from 'react';

import { REACT_APP_HASURA_URL } from 'config/env';
import { getAuthToken } from 'services/api';

import { Thunder, apiFetch, ValueTypes, $ } from './__generated__/zeusUser';

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

export function getUserClient(url: string, getToken: () => string | undefined) {
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

  const getCurrentEpoch = async (
    circle_id: number
  ): Promise<typeof currentEpoch | undefined> => {
    const {
      epochs: [currentEpoch],
    } = await makeQuery(url, getToken)('query')({
      epochs: [
        {
          where: {
            circle_id: { _eq: circle_id },
            end_date: { _gt: 'now()' },
            start_date: { _lt: 'now()' },
          },
        },
        { id: true },
      ],
    });
    return currentEpoch;
  };

  const updateProfileBackground = async (image_data_base64: string) =>
    makeQuery(url, getToken)('mutation')(
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

  const updateCircleLogo = async (
    circleId: number,
    image_data_base64: string
  ) =>
    makeQuery(url, getToken)('mutation')(
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
    updateProfile,
    getCurrentEpoch,
    updateProfileAvatar,
    updateProfileBackground,
    updateCircleLogo,
    createCircleIntegration,
    deleteCircleIntegration,
  };
}

export function useApi() {
  return useMemo(() => getGql(REACT_APP_HASURA_URL, getAuthToken), []);
}
