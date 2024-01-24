import assert from 'assert';

import { useWeb3React } from 'hooks/useWeb3React';

function useConnectedAddress(required: true): string;
function useConnectedAddress(required?: boolean): string | undefined;
function useConnectedAddress(required = false) {
  // TODO: use authstate instead of this web3 react
  const { account } = useWeb3React();
  assert(account || !required, 'no connected address found');
  return account || undefined;
}

export default useConnectedAddress;
