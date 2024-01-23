import { useMemo } from 'react';

import type { Web3Provider } from '@ethersproject/providers';

import { useWeb3React } from 'hooks/useWeb3React';
import { logOnce } from 'utils/logger';

import { Contracts } from './contracts';

export function useCoSoulContracts(): Contracts | undefined {
  const { library, active, chainId } = useWeb3React<Web3Provider>();

  const contractsChainId = 1338;

  return useMemo((): Contracts | undefined => {
    if (!library || !chainId) return undefined;

    if (chainId !== contractsChainId) {
      logOnce(`CoLinks/CoSoul contracts setup in readonly mode`);
    }

    return new Contracts(contractsChainId, library);
  }, [active, library, chainId]);
}
