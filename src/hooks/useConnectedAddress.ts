import { useWeb3React } from '@web3-react/core';

export default function useConnectedAddress() {
  const { account } = useWeb3React();

  return account ? account : undefined;
}
