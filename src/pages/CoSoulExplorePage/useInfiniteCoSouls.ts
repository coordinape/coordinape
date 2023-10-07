import { QueryKey, useInfiniteQuery } from 'react-query';

import { anonClient } from '../../lib/anongql/anonClient';
import { ValueTypes } from '../../lib/gql/__generated__/zeus';
import { Awaited } from '../../types/shim';

const PAGE_SIZE = 100;

export type Where = ValueTypes['cosouls_bool_exp'];
export type OrderBy = ValueTypes['cosouls_order_by'];

export const useInfiniteCoSouls = (
  queryKey: QueryKey,
  where: Where | null,
  orderBy: OrderBy[],
  onSettled?: () => void
) => {
  return useInfiniteQuery(
    queryKey,
    ({ pageParam = 0 }) => fetchCoSouls(where, orderBy, pageParam),
    {
      getNextPageParam: (lastPage, allPages) => {
        return lastPage.length == 0 ? undefined : allPages.length;
      },
      refetchOnWindowFocus: true,
      refetchInterval: 10000,
      onSettled: () => onSettled && onSettled(),
    }
  );
};

const fetchCoSouls = async (
  where: Where | null,
  orderBy: OrderBy[],
  page: number
) => {
  const { cosouls } = await anonClient.query(
    {
      cosouls: [
        {
          where,
          order_by: orderBy,
          offset: page * PAGE_SIZE,
          limit: PAGE_SIZE,
        },
        {
          address: true,
          id: true,
          token_id: true,
          pgive: true,
          profile_public: {
            name: true,
            avatar: true,
          },
        },
      ],
    },
    {
      operationName: 'cosoul_explore',
    }
  );
  return cosouls;
};

export type CoSoul = Awaited<ReturnType<typeof fetchCoSouls>>[number];
