import assert from 'assert';
import { useState, useMemo } from 'react';

import max from 'lodash/max';
import { useQuery, useQueryClient } from 'react-query';

import { QUERY_KEY_MAIN_HEADER } from 'components/MainLayout/getMainHeaderData';
import { useContracts } from 'hooks';
import useConnectedAddress from 'hooks/useConnectedAddress';
import { useMyProfile } from 'recoilState/app';

import { getClaims, QueryClaim } from './queries';
import { useClaimAllocation } from './useClaimAllocation';
import { createClaimsRows } from './utils';

export type ClaimsRowData = { claim: QueryClaim; group: QueryClaim[] };

export const useClaimsTableData = () => {
  const contracts = useContracts();
  const profile = useMyProfile();
  const address = useConnectedAddress();
  const claimTokens = useClaimAllocation();
  const queryClient = useQueryClient();

  const [claiming, setClaiming] = useState<
    Record<number, 'claimed' | 'pending' | null>
  >({});

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

  const [claimedClaimsRows, unclaimedClaimsRows] = useMemo(() => {
    return createClaimsRows(claims || []);
  }, [claims]);

  const processClaim = async (claimIds: number[]) => {
    const maxClaimId = max(claimIds);
    const claim = claims?.find(c => c.id === maxClaimId);
    assert(claim && address);
    const { index, proof, distribution } = claim;

    const { claims: jsonClaims } = distribution.distribution_json;

    // we use this value instead of the column on the claims row because it is
    // more precise
    const amount = jsonClaims[address.toLowerCase()].amount;

    setClaiming(val => ({ ...val, [claim.id]: 'pending' }));
    const hash = await claimTokens({
      claimIds,
      distribution,
      index,
      address,
      amount,
      proof: proof ? proof.split(',') : [],
    });
    if (hash) {
      refetch();
      queryClient.invalidateQueries(QUERY_KEY_MAIN_HEADER);
      setClaiming(val => ({ ...val, [claim.id]: 'claimed' }));
    } else {
      setClaiming(val => ({ ...val, [claim.id]: null }));
    }
  };

  return {
    isIdle,
    isLoading,
    isError,
    error,
    claims,
    refetch,
    claimedClaimsRows,
    unclaimedClaimsRows,
    processClaim,
    claiming,
  };
};
