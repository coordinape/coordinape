import { QueryKey, useInfiniteQuery } from 'react-query';

import {
  fetchCoSouls,
  OrderBy,
  Where,
} from '../../features/colinks/fetchCoSouls';

const PAGE_SIZE = 100;

export const useInfiniteCoSouls = (
  queryKey: QueryKey,
  where: Where | null,
  orderBy: OrderBy[],
  onSettled?: () => void
) => {
  return useInfiniteQuery(
    queryKey,
    ({ pageParam = 0 }) => fetchCoSouls(where, orderBy, pageParam, PAGE_SIZE),
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
