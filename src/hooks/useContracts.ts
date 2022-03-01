import { useMemo } from 'react';

import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';

import { supportedChainIds, Contracts } from 'services/contracts';

export function useContracts(): Contracts | undefined {
  const { library, active, chainId } = useWeb3React<Web3Provider>();

  return useMemo((): Contracts | undefined => {
    if (!library || !chainId || !supportedChainIds.includes(chainId))
      return undefined;
    return Contracts.forChain(chainId, library.getSigner());
  }, [active, library, chainId]);
}
