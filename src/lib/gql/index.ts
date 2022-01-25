import { REACT_APP_HASURA_URL } from 'config/env';
import { getAuthToken } from 'services/api';

import { Thunder, apiFetch, ValueTypes } from './zeusUser';

const makeQuery = () =>
  Thunder(
    apiFetch([
      REACT_APP_HASURA_URL,
      {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + getAuthToken(),
        },
      },
    ])
  );

export const updateProfile = async (
  id: number,
  profile: ValueTypes['profiles_set_input']
) =>
  makeQuery()('mutation')({
    update_profiles_by_pk: [
      { set: profile, pk_columns: { id } },
      { id: true, admin_view: true },
    ],
  });
