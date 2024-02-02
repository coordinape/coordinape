import { useRef } from 'react';

import { QueryKey } from 'react-query';

import { LoadingIndicator } from '../../components/LoadingIndicator';
import useConnectedAddress from '../../hooks/useConnectedAddress';
import { CoLinksMember } from '../../pages/colinks/explore/CoLinksMember';
import { Box, Flex, Panel } from '../../ui';
import { Where } from '../activities/useInfiniteActivities';

import { OrderBy, useInfiniteMembers } from './useInfiniteMembers';
import { QUERY_KEY_COLINKS } from './wizard/CoLinksWizard';

export const MEMBERS_QUERY_KEY = 'colinks_members';

export const InfiniteMembersList = ({
  queryKey,
  where,
  orderBy,
  includeRank,
}: {
  queryKey: QueryKey;
  where: Where;
  orderBy: OrderBy[];
  includeRank?: boolean;
}) => {
  const observerRef = useRef<HTMLDivElement>(null);

  const currentAddress = useConnectedAddress(true);

  const { data, isFetchingNextPage } = useInfiniteMembers(
    observerRef,
    currentAddress,
    [QUERY_KEY_COLINKS, MEMBERS_QUERY_KEY, ...queryKey],
    where,
    orderBy
  );

  if (!data) {
    return <LoadingIndicator />;
  }

  if (!data.pages[0]?.length) {
    return <Panel noBorder>No matching members</Panel>;
  }

  const items = data?.pages?.flat();
  return (
    <Flex
      column
      css={{
        gap: '$md',
        position: 'relative',
        flexGrow: 1,
      }}
    >
      {items &&
        items.map((p, index) => {
          return (
            <CoLinksMember
              key={p.id}
              profile={p}
              rankNumber={includeRank ? index + 1 : undefined}
            />
          );
        })}
      <Flex ref={observerRef} css={{ justifyContent: 'center' }}>
        {isFetchingNextPage ? <LoadingIndicator /> : <Box>&nbsp;</Box>}
      </Flex>
    </Flex>
  );
};
