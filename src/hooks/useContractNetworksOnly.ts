import { useEffect } from 'react';

import { useWeb3React } from '@web3-react/core';
import { vaultsSupportedChainIds } from 'common-lib/chains';
import { switchNetwork } from 'lib/web3-helpers';

import { useApeSnackbar } from 'hooks';

export default function useContractNetworksOnly() {
  const { chainId } = useWeb3React();
  const { showError } = useApeSnackbar();

  useEffect(() => {
    const isSupportedChainId =
      chainId && vaultsSupportedChainIds.includes(chainId.toString());
    if (!isSupportedChainId) {
      showError(
        `Contract interactions do not support chain ${chainId}. Please switch to Ethereum Mainnet.`
      );
      switchNetwork('1');
    }
  }, [chainId]);
}
