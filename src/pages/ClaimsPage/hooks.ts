import assert from 'assert';
import { useState, useMemo } from 'react';

import { useQuery } from 'react-query';

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

  const processClaim = async (claimId: number) => {
    const claim = claims?.find(c => c.id === claimId);
    assert(claim && address);
    const { index, proof, distribution } = claim;

    const { claims: jsonClaims } = JSON.parse(distribution.distribution_json);

    // we use this value instead of the column on the claims row because it is
    // more precise
    const amount = jsonClaims[address.toLowerCase()].amount;

    setClaiming(val => ({ ...val, [claim.id]: 'pending' }));
    const hash = await claimTokens({
      claimId: claim.id,
      distribution,
      index,
      address,
      amount,
      proof: proof ? proof.split(',') : [],
    });
    if (hash) refetch();
    setClaiming(val => ({ ...val, [claim.id]: 'claimed' }));
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
