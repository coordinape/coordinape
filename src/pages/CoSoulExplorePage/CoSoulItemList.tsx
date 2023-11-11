import { useCallback, useEffect, useRef } from 'react';

import { OrderBy, Where } from 'features/cosoul/fetchCoSouls';

import { LoadingIndicator } from '../../components/LoadingIndicator';
import { Box, Flex } from '../../ui';

import { CoSoulItem } from './CoSoulItem';
import { useInfiniteCoSouls } from './useInfiniteCoSouls';

export const COSOULS_QUERY_KEY = 'cosouls';

export const CoSoulItemList = ({
  where,
  orderBy,
  onSettled,
}: {
  where: Where | null;
  orderBy: OrderBy[];
  onSettled?: () => void;
}) => {
  const observerRef = useRef<HTMLDivElement>(null);
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useInfiniteCoSouls(
      [COSOULS_QUERY_KEY, JSON.stringify(where), JSON.stringify(orderBy)],
      where,
      orderBy,
      onSettled
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
      }}
    >
      {data && data.pages && (
        <Box
          css={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '$md',
            m: '$xl ',
          }}
        >
          {data.pages.map(page =>
            page.map(cosoul => <CoSoulItem cosoul={cosoul} key={cosoul.id} />)
          )}
        </Box>
      )}
      <Flex ref={observerRef} css={{ justifyContent: 'center' }}>
        {isFetchingNextPage ? <LoadingIndicator /> : <Box>&nbsp;</Box>}
      </Flex>
    </Flex>
  );
};
