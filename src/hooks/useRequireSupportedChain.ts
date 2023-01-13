import { useEffect } from 'react';

import { supportedChainIds } from 'lib/vaults';

import { useToast } from 'hooks';
import { switchNetwork } from 'utils/provider';

import { useWeb3React } from './useWeb3React';

export default function useRequireSupportedChain() {
  const { chainId } = useWeb3React();
  const { showError } = useToast();

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
