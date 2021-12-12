import assert from 'assert';
import { useMemo } from 'react';

import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';

import { NetworkId } from 'config/networks';
import { Contracts } from 'services/contracts';

function useContracts(): Contracts {
  const { library, active, chainId } = useWeb3React<Web3Provider>();

  return useMemo((): Contracts => {
    assert(library && chainId);
    assert(
      [4, 1337].includes(chainId),
      'unsupported network! use Rinkeby or localhost'
    );

    return Contracts.fromNetwork(chainId as NetworkId, library.getSigner());
  }, [active, library, chainId]);
}

export { useContracts };
