import assert from 'assert';

import { useAuthStore } from '../features/auth';

function useConnectedAddress(required: true): string;
function useConnectedAddress(required?: boolean): string | undefined;
function useConnectedAddress(required = false) {
  const account = useAuthStore(state => state.address);
  assert(account || !required, 'no connected address found');
  return account || undefined;
}

export default useConnectedAddress;
