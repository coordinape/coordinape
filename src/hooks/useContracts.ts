import { useMemo } from 'react';

import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { supportedChainIds, Contracts } from 'lib/vaults';

import { logOnce } from 'utils/logger';

export function useContracts(): Contracts | undefined {
  const { library, active, chainId } = useWeb3React<Web3Provider>();

  return useMemo((): Contracts | undefined => {
    if (!library || !chainId) return undefined;
    const isSupportedChainId = supportedChainIds.includes(chainId.toString());
    if (!isSupportedChainId) {
      logOnce(`Contracts do not support chain ${chainId}`);
      return undefined;
    }

    return new Contracts(chainId, library);
  }, [active, library, chainId]);
}
