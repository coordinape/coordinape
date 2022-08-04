import assert from 'assert';
import { useState, useMemo } from 'react';

import groupBy from 'lodash/groupBy';
import partition from 'lodash/partition';
import { useQuery } from 'react-query';

import { useContracts } from 'hooks';
import useConnectedAddress from 'hooks/useConnectedAddress';
import { useMyProfile } from 'recoilState/app';

import { getClaims, QueryClaim } from './queries';
import { useClaimAllocation } from './useClaimAllocation';
import { claimsRowKey, claimRows } from './utils';

export type ClaimsRowData = {
  claimsRow: QueryClaim;
  group: QueryClaim[];
};

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
    const [claimedClaims, unclaimedClaims] = partition(claims, 'txHash');
    const claimedClaimsGroupByRow = groupBy(claimedClaims, c => {
      return claimsRowKey(c);
    });

    const unclaimedClaimsGroupByRow = groupBy(unclaimedClaims, c => {
      return claimsRowKey(c);
    });

    const claimedClaimsRows = claimRows(claimedClaims).map(claimsRow => ({
      claimsRow,
      group: claimedClaimsGroupByRow[claimsRowKey(claimsRow)],
    }));

    const unclaimedClaimsRows = claimRows(unclaimedClaims).map(claimsRow => ({
      claimsRow,
      group: unclaimedClaimsGroupByRow[claimsRowKey(claimsRow)],
    }));

    return [claimedClaimsRows, unclaimedClaimsRows];
  }, [claims]);

  const processClaim = async (claimId: number) => {
    const claim = claims?.find(c => c.id === claimId);
    assert(claim);
    assert(address);
    const { index, proof, distribution } = claim;

    const { claims: jsonClaims } = JSON.parse(distribution.distribution_json);
    const amount = jsonClaims[address.toLowerCase()].amount;

    setClaiming(val => ({ ...val, [claim.id]: 'pending' }));
    const hash = await claimTokens({
      claimId: claim.id,
      circleId: distribution.epoch.circle?.id,
      vault: distribution.vault,
      index: index,
      address,
      amount,
      proof: proof.split(','),
      distributionEpochId: distribution.distribution_epoch_id,
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
