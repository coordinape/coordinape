import { useEffect } from 'react';

import { useWeb3React } from '@web3-react/core';
import { supportedChainIds } from 'lib/vaults';

import { useApeSnackbar } from 'hooks';
import { switchNetwork } from 'utils/provider';

export default function useRequireSupportedChain() {
  const { chainId } = useWeb3React();
  const { showError } = useApeSnackbar();

  useEffect(() => {
    const isSupportedChainId =
      chainId && supportedChainIds.includes(chainId.toString());
    if (!isSupportedChainId) {
      showError(
        `Contract interactions do not support chain ${chainId}. Please switch to Ethereum Mainnet.`
      );
      switchNetwork('1');
    }
  }, [chainId]);
}
