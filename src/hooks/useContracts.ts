import assert from 'assert';
import { useMemo } from 'react';

import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';

import { NetworkId } from 'config/networks';
import { Contracts } from 'services/contracts';

function useContracts(): Contracts | undefined {
  const { library, active, chainId } = useWeb3React<Web3Provider>();

  return useMemo((): Contracts | undefined => {
    assert(library && chainId);
    if (![4, 1337].includes(chainId)) return undefined;
    return Contracts.fromNetwork(chainId as NetworkId, library.getSigner());
  }, [active, library, chainId]);
}

export { useContracts };
