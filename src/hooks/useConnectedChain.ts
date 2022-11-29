import { useWeb3React } from '@web3-react/core';
import { loginSupportedChainIds } from 'common-lib/constants';

export default function useConnectedChain() {
  const { chainId } = useWeb3React();
  return {
    chainId,
    chainName: chainId ? loginSupportedChainIds[chainId.toString()] : undefined,
  };
}
