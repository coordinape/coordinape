import { useCallback, useEffect, useRef, useState } from 'react';

import { QueryKey, useQueryClient } from 'react-query';

import { LoadingIndicator } from '../../components/LoadingIndicator';
import { Box, Flex } from '../../ui';

import { ActivityRow } from './ActivityRow';
import { useInfiniteActivities, Where } from './useInfiniteActivities';

export const ACTIVITIES_QUERY_KEY = 'activities';

export const ActivityList = ({
  queryKey,
  where,
  drawer,
  onSettled,
  noPosts,
  pollForNewActivity,
}: {
  queryKey: QueryKey;
  where: Where;
  pollForNewActivity?: boolean;
  drawer?: boolean;
  onSettled?: () => void;
  noPosts?: React.ReactNode;
}) => {
  const observerRef = useRef<HTMLDivElement>(null);

  const [, setLatestActivityId] = useState(-1);

  const queryClient = useQueryClient();

  const [pollQuicklyUntil, setPollQuicklyUntil] = useState<Date | null>(null);

  // When we are expecting new activity, poll for new activity quickly for 5 seconds
  useEffect(() => {
    // TODO: we should do a better job of knowing when our post comes through and stop polling
    // we could also do a better job of the showLoading indicator
    if (pollForNewActivity) {
      setTimeout(
        () => queryClient.invalidateQueries([ACTIVITIES_QUERY_KEY, queryKey]),
        250
      );
      // its ok to poll quickly for 30 seconds
      setPollQuicklyUntil(new Date(Date.now() + 5000));
    }
  }, [pollForNewActivity]);

  const refetchInterval =
    pollQuicklyUntil && Date.now() < pollQuicklyUntil.getTime()
      ? 500
      : undefined;

  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useInfiniteActivities(
      [ACTIVITIES_QUERY_KEY, queryKey],
      where,
      setLatestActivityId,
      onSettled,
      refetchInterval
    );

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

  if (!data) {
    return <LoadingIndicator />;
  }

  if (!data.pages[0]?.length && noPosts) {
    return <>{noPosts}</>;
  }

  return (
    <Flex
      column
      css={{
        gap: '$md',
        position: 'relative',
        flexGrow: 1,
      }}
    >
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
