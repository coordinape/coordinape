import {
  ValueTypes,
  GraphQLTypes,
  InputType,
  Thunder,
  apiFetch,
} from 'lib/gql/__generated__/zeusUser';
import type { UseQueryOptions } from 'react-query';
import { useMutation, UseMutationOptions, useQuery } from 'react-query';

import { getAuthToken } from '../services/api';
import { REACT_APP_HASURA_URL } from 'config/env';
import { useSelectedCircle } from 'recoilState';

const thunder = Thunder(async (...params) => {
  const fetch = apiFetch([
    REACT_APP_HASURA_URL,
    {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + getAuthToken(),
      },
    },
  ]);

  return fetch(...params);
});

export function useTypedQuery<
  TData extends ValueTypes['query_root'],
  TResult = InputType<GraphQLTypes['query_root'], TData>
>(
  queryKey: string | [string, ...unknown[]],
  query: TData | ValueTypes['query_root'],
  options?: Omit<UseQueryOptions<TResult>, 'queryKey' | 'queryFn'>,
  variables?: Record<string, any>
) {
  return useQuery<TResult>(
    queryKey,
    () =>
      thunder('query')(query, {
        operationName: typeof queryKey === 'string' ? queryKey : queryKey[0],
        variables,
      }) as Promise<TResult>,
    options
  );
}

// Example usage of useTypedMutation inside a React Component
//
// const createNomineeMutation = useTypedMutation(
//   (payload: ValueTypes['CreateNomineeInput']) => ({
//     createNominee: [
//       { payload: payload },
//       {
//         nominee: {
//           id: true,
//           name: true,
//         },
//       },
//     ],
//   }),
//   {
//     onSuccess: data => {
//       console.log('Successfully created nominee', data.createNominee?.nominee.name);
//     },
//     onError: (e, payload) => {
//       console.warn('Failed to create nominee', (e as Error).message, payload);
//     },
//   }
// );
//
// const createNominee = useCallback(() => {
//   createNomineeMutation.mutate({ address: '', name: '', circle_id: 1, description: '' });
// }, []);

export function useTypedMutation<
  TMutation extends ValueTypes['mutation_root'],
  TResult = InputType<GraphQLTypes['mutation_root'], TMutation>,
  TVariables = void
>(
  mutationFn: (variables: TVariables) => TMutation,
  options?: Omit<UseMutationOptions<TResult, unknown, TVariables>, 'mutationFn'>
) {
  return useMutation<TResult, unknown, TVariables>(
    (variables: TVariables) =>
      thunder('mutation')(mutationFn(variables)) as Promise<TResult>,
    options
  );
}

export function useCurrentOrg() {
  const id = useSelectedCircle().circle.protocol_id;

  return useTypedQuery(['org', id], {
    organizations_by_pk: [{ id }, { id: true, name: true }],
  }).data?.organizations_by_pk;
}
