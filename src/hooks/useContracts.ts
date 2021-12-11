import assert from 'assert';
import { useMemo } from 'react';

import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';

import { Contracts } from 'services/contracts';

import { NetworkId } from 'types';

function useContracts(): Contracts {
  const context = useWeb3React<Web3Provider>();
  const { library, active, chainId } = context;

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
