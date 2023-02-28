import { useCallback, useEffect, useRef } from 'react';

import { QueryKey } from 'react-query';

import { LoadingIndicator } from '../../components/LoadingIndicator';
import { Flex, Text } from '../../ui';

import { ActivityRow } from './ActivityRow';
import { useInfiniteActivities, Where } from './useInfiniteActivities';

export const ActivityList = ({
  queryKey,
  where,
}: {
  queryKey: QueryKey;
  where: Where;
}) => {
  const observerRef = useRef<HTMLDivElement>(null);

  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useInfiniteActivities(queryKey, where);

  const handleObserver = useCallback(
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

  if (!data) {
    return <LoadingIndicator />;
  }

  return (
    <Flex
      column
      css={{
        gap: '$md',
        [`${ActivityRow} + ${ActivityRow}`]: {
          borderBottom: '1px solid $dim',
          background: 'red',
        },
      }}
    >
      {data &&
        data.pages &&
        data.pages.map(page =>
          page.map(c => {
            return <ActivityRow key={c.id} activity={c} />;
          })
        )}{' '}
      <Flex ref={observerRef} css={{ justifyContent: 'center' }}>
        {isFetchingNextPage ? (
          <LoadingIndicator />
        ) : (
          <Flex
            css={{
              borderTop: '1px solid $dim',
              width: '100%',
              pt: '$md',
              justifyContent: 'center',
            }}
          >
            <Text semibold>No Items Left</Text>
          </Flex>
        )}
      </Flex>
    </Flex>
  );
};
