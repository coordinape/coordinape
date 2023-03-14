import { useWeb3React } from 'hooks/useWeb3React';

export default function useConnectedAddress() {
  const { account } = useWeb3React();
  return account || undefined;
}
