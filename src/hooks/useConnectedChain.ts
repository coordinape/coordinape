import { loginSupportedChainIds } from 'common-lib/constants';

import { useWeb3React } from './useWeb3React';

export default function useConnectedChain() {
  const { chainId } = useWeb3React();
  return {
    chainId,
    chainName: chainId ? loginSupportedChainIds[chainId.toString()] : undefined,
  };
}
