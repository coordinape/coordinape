import {
  ValueTypes,
  GraphQLTypes,
  InputType,
  OperationOptions,
  chainOptions,
  token_gifts_select_column,
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
          id: true,
          name: true,
          users: [
            {},
            {
              address: true,
              name: true,
              id: true,
              circle_id: true,
              starting_tokens: true,
              received_gifts: [
                { where: { epoch_id: { _eq: epochId } } },
                { tokens: true },
              ],
              received_gifts_aggregate: [
                { where: { epoch_id: { _eq: epochId } } },
                {
                  aggregate: {
                    count: [
                      {
                        columns: [token_gifts_select_column.recipient_id],
                      },
                      true,
                    ],
                  },
                },
              ],
            },
          ],
        },
      },
    ],
  });
}
