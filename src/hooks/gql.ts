import {
  ValueTypes,
  GraphQLTypes,
  InputType,
  Chain,
  OperationOptions,
  chainOptions,
} from 'lib/gql/zeusUser';
import { useQuery } from 'react-query';
import type { UseQueryOptions } from 'react-query';

import { REACT_APP_HASURA_URL } from 'config/env';
import { useSelectedCircle } from 'recoilState';

// TODO: Finalize a pattern and have this as it's own hook
// We can't use Zeus' generated file becuase they hardcode the host.
// Also, what is the pattern for relating to empty responses
// With Recoil the app is suspended if there isn't a value
// It's okay as a demo, but a general strategy is needed to have a sane developer experience
//
// Additionally: exrhizo needed to manually set bigint to number rather than "any"
// So, investigate how to improve the flow for that
//
// And, how do we standardize query invalidation
function useTypedQuery<
  O extends 'query_root',
  TData extends ValueTypes[O],
  TResult = InputType<GraphQLTypes[O], TData>
>(
  queryKey: string,
  query: TData | ValueTypes[O],
  options?: Omit<UseQueryOptions<TResult>, 'queryKey' | 'queryFn'>,
  zeusOptions?: OperationOptions,
  host = REACT_APP_HASURA_URL,
  hostOptions: chainOptions[1] = {}
) {
  return useQuery<TResult>(
    queryKey,
    () =>
      Chain(host, hostOptions)('query')(query, zeusOptions) as Promise<TResult>,
    options
  );
}

export function useCurrentOrg() {
  const orgId = useSelectedCircle().circle.protocol_id;
  return useTypedQuery(
    'org',
    { organizations_by_pk: [{ id: orgId }, { id: true, name: true }] },
    { suspense: true }
  ).data?.organizations_by_pk;
}
