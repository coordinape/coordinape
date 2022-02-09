import {
  ValueTypes,
  GraphQLTypes,
  InputType,
  OperationOptions,
  chainOptions,
} from 'lib/gql/zeusUser';
import { useTypedQuery as _useTypedQuery } from 'lib/gql/zeusUser/reactQuery';
import type { UseQueryOptions } from 'react-query';

import { getAuthToken } from '../services/api';
import { REACT_APP_HASURA_URL } from 'config/env';
import { useSelectedCircle } from 'recoilState';

function useTypedQuery<
  O extends 'query_root',
  TData extends ValueTypes[O],
  TResult = InputType<GraphQLTypes[O], TData>
>(
  queryKey: string,
  query: TData | ValueTypes[O],
  options?: Omit<UseQueryOptions<TResult>, 'queryKey' | 'queryFn'>,
  zeusOptions?: OperationOptions,
  hostOptions: chainOptions[1] = {}
) {
  return _useTypedQuery(
    queryKey,
    query,
    { ...options, suspense: true },
    zeusOptions,
    REACT_APP_HASURA_URL,
    {
      ...hostOptions,
      method: 'POST',
      headers: { Authorization: 'Bearer ' + getAuthToken() },
    }
  );
}

export function useCurrentOrg() {
  const id = useSelectedCircle().circle.protocol_id;

  return useTypedQuery(`org-${id}`, {
    organizations_by_pk: [{ id }, { id: true, name: true }],
  }).data?.organizations_by_pk;
}

export function useEpochIdForCircle(epochId: number) {
  return useTypedQuery(`circle-for-epoch-${epochId}`, {
    epochs_by_pk: [
      { id: epochId },
      {
        id: true,
        ended: true,
        circle_id: true,
        number: true,
        circle: {
          alloc_text: true,
          auto_opt_out: true,
          created_at: true,
          default_opt_in: true,
          id: true,
          is_verified: true,
          logo: true,
          min_vouches: true,
          name: true,
          protocol_id: true,
          team_sel_text: true,
          team_selection: true,
          token_name: true,
          updated_at: true,
          vouching: true,
          vouching_text: true,
          users: [
            {},
            {
              address: true,
              name: true,
              id: true,
              circle_id: true,
              non_giver: true,
              fixed_non_receiver: true,
              starting_tokens: true,
              non_receiver: true,
              give_token_received: true,
              give_token_remaining: true,
              epoch_first_visit: true,
              created_at: true,
              updated_at: true,
              role: true,
            },
          ],
        },
      },
    ],
  });
}
