import { useCallback, useEffect } from 'react';

import { QueryKey, useInfiniteQuery } from 'react-query';

import { ValueTypes } from '../../lib/gql/__generated__/zeus';
import { client } from '../../lib/gql/client';
import { coLinksMemberSelector } from '../../pages/colinks/explore/CoLinksMember';

const PAGE_SIZE = 10;

export type Where = ValueTypes['profiles_public_bool_exp'];
export type OrderBy = ValueTypes['profiles_public_order_by'];

const getMembers = async (
  currentAddress: string,
  where: Where,
  orderBy: OrderBy[],
  page: number
) => {
  const { profiles_public } = await client.query(
    {
      profiles_public: [
        {
          where: {
            links_held: {
              _gt: 0,
            },
            ...where,
          },
          order_by: orderBy,
          offset: page * PAGE_SIZE,
          limit: PAGE_SIZE,
        },
        coLinksMemberSelector(currentAddress),
      ],
    },
    {
      operationName: 'getInfiniteMembers',
    }
  );

  return profiles_public;
};

export const useInfiniteMembers = (
  observerRef: React.MutableRefObject<HTMLDivElement | null>,
  currentAddress: string,
  queryKey: QueryKey,
  where: Where,
  orderBy: OrderBy[]
) => {
  const iq = useInfiniteQuery(
    queryKey,
    ({ pageParam = 0 }) =>
      getMembers(currentAddress, where, orderBy, pageParam),
    {
      getNextPageParam: (lastPage, allPages) => {
        return lastPage.length == 0 ? undefined : allPages.length;
      },
      refetchOnWindowFocus: true,
      refetchInterval: 10000,
    }
  );

  const { fetchNextPage, hasNextPage } = iq;

  const handleObserver = useCallback<
    (entries: IntersectionObserverEntry[]) => void
  >(
    entries => {
      const [target] = entries;
      if (target.isIntersecting) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage]
  );

  useEffect(() => {
    const element = observerRef.current;
    if (element) {
      const option = { threshold: 0 };

      const observer = new IntersectionObserver(handleObserver, option);
      observer.observe(element);
      return () => observer.unobserve(element);
    }
  }, [fetchNextPage, hasNextPage, handleObserver]);

  return { ...iq };
};
