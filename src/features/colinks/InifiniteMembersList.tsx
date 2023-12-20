import { useCallback, useEffect, useRef } from 'react';

import { QueryKey } from 'react-query';

import { LoadingIndicator } from '../../components/LoadingIndicator';
import useConnectedAddress from '../../hooks/useConnectedAddress';
import { CoLinksMember } from '../../pages/colinks/explore/CoLinksMember';
import { Box, Flex, Panel } from '../../ui';
import { Where } from '../activities/useInfiniteActivities';

import { OrderBy, useInfiniteMembers } from './useInfiniteMembers';
import { QUERY_KEY_COLINKS } from './wizard/CoLinksWizard';

const MEMBERS_QUERY_KEY = 'colinks_members';

export const InfiniteMembersList = ({
  queryKey,
  where,
  orderBy,
}: {
  queryKey: QueryKey;
  where: Where;
  orderBy: OrderBy[];
}) => {
  const observerRef = useRef<HTMLDivElement>(null);

  const currentAddress = useConnectedAddress(true);

  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useInfiniteMembers(
      currentAddress,
      [QUERY_KEY_COLINKS, MEMBERS_QUERY_KEY, ...queryKey],

      where,
      orderBy
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

  if (!data.pages[0]?.length) {
    return <Panel noBorder>No matching members</Panel>;
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
          page.map(p => {
            return <CoLinksMember key={p.id} profile={p} />;
          })
        )}{' '}
      <Flex ref={observerRef} css={{ justifyContent: 'center' }}>
        {isFetchingNextPage ? <LoadingIndicator /> : <Box>&nbsp;</Box>}
      </Flex>
    </Flex>
  );
};
