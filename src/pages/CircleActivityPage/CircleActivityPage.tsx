import assert from 'assert';
import { useCallback, useEffect, useRef } from 'react';

import { useInfiniteQuery } from 'react-query';
import { useParams } from 'react-router-dom';

import { LoadingIndicator } from '../../components/LoadingIndicator';
import { ActivityItem } from '../../features/activity/ActivityItem';
import { getActivities } from '../../features/activity/getActivities';
import { ContentHeader, Flex, Text } from '../../ui';
import { SingleColumnLayout } from '../../ui/layouts';

export const CircleActivityPage = () => {
  const { circleId: circleIdS } = useParams();

  assert(circleIdS);

  const circleId = parseInt(circleIdS);
  const observerRef = useRef<HTMLDivElement>(null);

  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery(
      'repos',
      ({ pageParam = 0 }) => getActivities(circleId, pageParam),
      {
        getNextPageParam: (lastPage, allPages) => {
          return lastPage.length == 0 ? undefined : allPages.length + 1;
        },
        refetchOnWindowFocus: false,
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

  return (
    <SingleColumnLayout>
      <ContentHeader>
        <Flex column css={{ gap: '$sm', flexGrow: 1 }}>
          <Text h1>Activity</Text>
          <Text p as="p">
            See what&apos;s up!!
          </Text>
        </Flex>
      </ContentHeader>

      {!data && <LoadingIndicator />}

      <Flex
        column
        css={{
          gap: '$md',
          [`${ActivityItem} + ${ActivityItem}`]: {
            borderBottom: '1px solid $dim',
            background: 'red',
          },
        }}
      >
        {data &&
          data.pages &&
          data.pages.map(page =>
            page.map(c => {
              return <ActivityItem key={c.id} activity={c} />;
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
    </SingleColumnLayout>
  );
};
