import {
  ValueTypes,
  GraphQLTypes,
  InputType,
  OperationOptions,
  chainOptions,
} from 'lib/gql/__generated__/zeusUser';
import {
  useTypedQuery as _useTypedQuery,
  useTypedMutation as _useTypedMutation,
} from 'lib/gql/__generated__/zeusUser/reactQuery';
import type { UseQueryOptions } from 'react-query';
import { UseMutationOptions } from 'react-query';

import { getAuthToken } from '../services/api';
import { REACT_APP_HASURA_URL } from 'config/env';
import { useSelectedCircle } from 'recoilState';

export function useTypedQuery<
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

// this isn't used yet, but it would be great to be able to use it
// I couldn't figure out how to get it to work with variables -CryptoGraffe
export function useTypedMutation<
  O extends 'mutation_root',
  TData extends ValueTypes[O],
  TResult = InputType<GraphQLTypes[O], TData>
>(
  mutationKey: string | unknown[],
  mutation: TData | ValueTypes[O],
  options?: Omit<UseMutationOptions<TResult>, 'mutationKey' | 'mutationFn'>,
  zeusOptions?: OperationOptions,
  hostOptions: chainOptions[1] = {}
) {
  return _useTypedMutation(
    mutationKey,
    mutation,
    options, // suspense not an option here
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

export function useCurrentCircleIntegrations() {
  const { circleId } = useSelectedCircle();
  const query = useTypedQuery(`circle-integrations-${circleId}`, {
    circles_by_pk: [
      { id: circleId },
      {
        id: true,
        integrations: [
          {},
          { id: true, type: true, name: true, data: [{ path: '$' }, true] },
        ],
      },
    ],
  });
  return {
    refetch: query.refetch,
    integrations: query.data?.circles_by_pk?.integrations ?? [],
  };
}
