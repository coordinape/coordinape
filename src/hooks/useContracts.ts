import { useMemo } from 'react';

import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';

import { HARDHAT_CHAIN_ID } from 'config/env';
import { Contracts } from 'services/contracts';

// FIXME: this should be derived from what's present in the hardhat package's
// deployment info
const SUPPORTED_CHAIN_IDS = [4, HARDHAT_CHAIN_ID];

export function useContracts(): Contracts | undefined {
  const { library, active, chainId } = useWeb3React<Web3Provider>();

  return useMemo((): Contracts | undefined => {
    if (!library || !chainId || !SUPPORTED_CHAIN_IDS.includes(chainId))
      return undefined;
    return Contracts.forChain(chainId, library.getSigner());
  }, [active, library, chainId]);
}
