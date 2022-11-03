import { useEffect } from 'react';

import { useWeb3React } from '@web3-react/core';
import { Contracts } from 'lib/vaults';
import { switchNetwork } from 'lib/web3-helpers';

import { useApeSnackbar } from 'hooks';

export default function useContractNetworksOnly(
  contracts: Contracts | undefined
) {
  const { chainId } = useWeb3React();
  const { showError } = useApeSnackbar();

  useEffect(() => {
    if (contracts === undefined) {
      showError(
        `Contract interactions do not support chain ${chainId}. Please switch to Ethereum Mainnet.`
      );
      switchNetwork('1');
    }
  }, [contracts, chainId]);
}
