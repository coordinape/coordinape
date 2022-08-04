import assert from 'assert';

import groupBy from 'lodash/groupBy';
import { useQuery } from 'react-query';

import { useContracts } from 'hooks';
import useConnectedAddress from 'hooks/useConnectedAddress';
import { useMyProfile } from 'recoilState/app';

import { getClaims } from './queries';
import { claimsRowKey } from './utils';

export const useClaimsTableData = () => {
  const contracts = useContracts();
  const profile = useMyProfile();
  const address = useConnectedAddress();

  const {
    isIdle,
    isLoading,
    isError,
    error,
    data: claims,
    refetch,
  } = useQuery(
    ['claims', profile.id],
    () => {
      assert(contracts);
      return getClaims(profile.id, contracts);
    },
    {
      enabled: !!(contracts && address),
      retry: false,
      staleTime: Infinity,
    }
  );

  const claimedClaimsGroupByRow = groupBy(
    claims?.filter(c => c.txHash).sort(c => -c.id),
    c => {
      return claimsRowKey(c.distribution, c.txHash);
    }
  );

  const unclaimedClaimsGroupByRow = groupBy(
    claims?.filter(c => !c.txHash).sort(c => c.id),
    c => {
      return claimsRowKey(c.distribution);
    }
  );

  return {
    isIdle,
    isLoading,
    isError,
    error,
    claims,
    refetch,
    claimedClaimsGroupByRow,
    unclaimedClaimsGroupByRow,
  };
};
