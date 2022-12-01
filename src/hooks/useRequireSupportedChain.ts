import { useEffect } from 'react';

import { supportedChainIds } from 'lib/vaults';

import { useApeSnackbar } from 'hooks';
import { useWeb3React } from 'hooks/useWeb3React';
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
