import { useCallback, useEffect, useRef } from 'react';

import { QueryKey } from 'react-query';

import { LoadingIndicator } from '../../components/LoadingIndicator';
import { Box, Flex } from '../../ui';

import { ActivityRow } from './ActivityRow';
import { useInfiniteActivities, Where } from './useInfiniteActivities';

export const ACTIVITIES_QUERY_KEY = 'activities';

export const ActivityList = ({
  queryKey,
  where,
  drawer,
}: {
  queryKey: QueryKey;
  where: Where;
  drawer?: boolean;
}) => {
  const observerRef = useRef<HTMLDivElement>(null);

  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useInfiniteActivities([ACTIVITIES_QUERY_KEY, queryKey], where);

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
        position: 'relative',
      }}
    >
      {!drawer && (
        <Box
          css={{
            width: 1,
            background: '$primary',
            height: '100%',
            position: 'absolute',
            top: 0,
            left: 40,
            zIndex: -1,
          }}
        />
      )}
      {data &&
        data.pages &&
        data.pages.map(page =>
          page.map(c => {
            return <ActivityRow key={c.id} activity={c} drawer={drawer} />;
          })
        )}{' '}
      <Flex ref={observerRef} css={{ justifyContent: 'center' }}>
        {isFetchingNextPage ? <LoadingIndicator /> : <Box>&nbsp;</Box>}
      </Flex>
    </Flex>
  );
};
