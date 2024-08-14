import { useEffect } from 'react';

import { findConnectorName } from 'features/auth/connectors';
import { supportedChainIds } from 'lib/vaults';

import { EConnectorNames } from 'config/constants';
import { useToast } from 'hooks';
import { switchNetwork } from 'utils/provider';

import { useWeb3React } from './useWeb3React';

export default function useRequireSupportedChain() {
  const { chainId, connector, providerType } = useWeb3React();
  const { showError } = useToast();

  useEffect(() => {
    const isSupportedChainId =
      chainId && supportedChainIds.includes(chainId.toString());
    if (!isSupportedChainId) {
      showError(
        `Contract interactions do not support chain ${chainId}. Please switch to Ethereum Mainnet.`
      );

      // Only prompt to switch networks if using Injected connector
      const connectorName = connector
        ? findConnectorName(connector)
        : providerType;

      if (connectorName === EConnectorNames.Injected) {
        switchNetwork('1');
      }
    }
  }, [chainId]);
}
