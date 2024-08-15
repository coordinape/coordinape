import { useMemo } from 'react';

import { useWalletClient } from 'wagmi';

import {
  CoSoulWithWallet,
  getCoSoulContractWithWallet,
} from '../../utils/viem/contracts';

export function useCoSoulContracts(): CoSoulWithWallet | undefined {
  const { data: client, isFetched } = useWalletClient();

  return useMemo((): CoSoulWithWallet | undefined => {
    if (!client || !isFetched) {
      return undefined;
    }

    // const isSupportedChainId = supportedChainIds.includes(chainId.toString());

    // if (!isSupportedChainId) {
    //   logOnce(`Contracts do not support chain ${chainId}`);
    //   return undefined;
    // }

    return getCoSoulContractWithWallet(client);
  }, [client, isFetched]);
}
