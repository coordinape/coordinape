import { useCallback, useEffect, useRef, useState } from 'react';

import { ApolloError } from '@apollo/client';
import * as Sentry from '@sentry/react';
import { cursor_ordering } from 'lib/gql/__generated__/zeus';
import { useTypedSubscription } from 'lib/gql/client';
import { QueryKey, useQueryClient } from 'react-query';

import { LoadingIndicator } from '../../components/LoadingIndicator';
import { Box, Flex } from '../../ui';
import {
  useInfiniteActivities,
  Where,
} from '../activities/useInfiniteActivities';

import { ActivityRow } from './ActivityRow';

export const ACTIVITIES_QUERY_KEY = 'activities';

export const ActivityList = ({
  queryKey,
  where,
  drawer,
  onSettled,
}: {
  queryKey: QueryKey;
  where: Where;
  drawer?: boolean;
  onSettled?: () => void;
}) => {
  const observerRef = useRef<HTMLDivElement>(null);

  const [latestActivityId, setLatestActivityId] = useState(-1);

  const client = useQueryClient();

  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useInfiniteActivities(
      [ACTIVITIES_QUERY_KEY, queryKey],
      where,
      setLatestActivityId,
      onSettled
    );

  // TODO: if we handle sort/filters this will need to change
  useTypedSubscription(
    {
      activities_stream: [
        {
          batch_size: 10,
          where: where,
          cursor: [
            {
              initial_value: { id: latestActivityId },
              ordering: cursor_ordering.ASC,
            },
          ],
        },
        {
          id: true,
        },
      ],
    },
    {
      skip: latestActivityId === -1,

      onData: () => {
        client.invalidateQueries([ACTIVITIES_QUERY_KEY, queryKey]);
      },
      onError: (error: ApolloError) => {
        Sentry.captureException(error);
        console.error(
          'Encountered an error fetching websocket subscription to activities stream',
          error
        );
      },
    }
  );

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
