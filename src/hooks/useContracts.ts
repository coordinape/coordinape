import { useMemo } from 'react';

import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';

import { Contracts } from 'utils/contracts';

function useContracts(): Contracts | undefined {
  const context = useWeb3React<Web3Provider>();
  const { library, active, chainId } = context;

  return useMemo((): Contracts | undefined => {
    if (!library) {
      return;
    }

    if (chainId !== 1337) {
      throw new Error(`Unsupported chainId: ${chainId}`);
    }

    return Contracts.fromNetwork(chainId, library);
  }, [active, library, chainId]);
}

export { useContracts };
