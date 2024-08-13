import { loginSupportedChainIds } from 'common-lib/constants';
import { useAccount } from 'wagmi';

export default function useConnectedChain() {
  const { chainId } = useAccount();
  return {
    chainId,
    chainName: chainId ? loginSupportedChainIds[chainId.toString()] : undefined,
  };
}
