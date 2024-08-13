import assert from 'assert';
import { useContext } from 'react';

import { ACTIVITIES_QUERY_KEY } from 'features/activities/ActivityList';
import { useQuery, useQueryClient } from 'react-query';
import { Address } from 'viem';

import { CoLinksContext } from './CoLinksContext';
import { MEMBERS_QUERY_KEY } from './InifiniteMembersList';
import { QUERY_KEY_COLINKS_NAV } from './useCoLinksNavQuery';
import { QUERY_KEY_COLINKS } from './wizard/CoLinksWizard';

export const useLinkingStatus = ({
  address,
  target,
}: {
  address?: string;
  target: string;
}) => {
  const { coLinksReadOnly } = useContext(CoLinksContext);

  const { data: balances, refetch } = useQuery(
    [QUERY_KEY_COLINKS, address, target],
    async () => {
      assert(coLinksReadOnly);
      assert(address);
      assert(target);
      // your balance of them
      const balance = await coLinksReadOnly.read.linkBalance([
        target as Address,
        address as Address,
      ] as const);
      // their balance of you
      const targetBalance = await coLinksReadOnly.read.linkBalance([
        address as Address,
        target as Address,
      ] as const);
      const supply = await coLinksReadOnly.read.linkSupply([
        target as Address,
      ] as const);
      const superFriend = targetBalance > 0n && balance > 0n;
      return { balance, targetBalance, supply, superFriend };
    },
    {
      enabled: !!coLinksReadOnly && !!address && !!target,
    }
  );

  const queryClient = useQueryClient();
  const refresh = () => {
    refetch();
    setTimeout(() => {
      queryClient.invalidateQueries([QUERY_KEY_COLINKS, target]);
      queryClient.invalidateQueries([QUERY_KEY_COLINKS, address]);
      // this is for the wizard, prove we bought our own key
      queryClient.invalidateQueries([QUERY_KEY_COLINKS_NAV]);
      queryClient.invalidateQueries([QUERY_KEY_COLINKS, MEMBERS_QUERY_KEY]);
      queryClient.invalidateQueries([
        ACTIVITIES_QUERY_KEY,
        [QUERY_KEY_COLINKS, 'activity'],
      ]);
    }, 2000);
  };

  if (!address) {
    return {
      balance: 0n,
      targetBalance: 0n,
      supply: 0n,
      superFriend: false,
      refresh: () => {},
    };
  }
  return { ...balances, refresh };
};
