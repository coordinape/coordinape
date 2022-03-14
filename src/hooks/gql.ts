import {
  ValueTypes,
  GraphQLTypes,
  InputType,
  OperationOptions,
  chainOptions,
} from 'lib/gql/zeusUser';
import {
  useTypedQuery as _useTypedQuery,
  useTypedMutation as _useTypedMutation,
} from 'lib/gql/zeusUser/reactQuery';
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

// Leaving this in here for now but we should determine where global queries should go
export function useCurrentOrg() {
  const id = useSelectedCircle().circle.protocol_id;

  //return useQuery([`org-${id}`], () => client.query({ organizations_by_pk: [{ id }, { id: true, name: true }]}));
  return useTypedQuery(`org-${id}`, {
    organizations_by_pk: [{ id }, { id: true, name: true }],
  });
}
