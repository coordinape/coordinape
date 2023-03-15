import { PROVIDER_TYPE as MAGIC_PROVIDER_TYPE } from './magic';
import { useAuthStore } from './store';

export { RequireAuth } from './RequireAuth';
export { useAuthStore } from './store';
export { useLoginData } from './useLoginData';
export { getAuthToken, setAuthToken } from './token';
export { useWalletStatus } from './useWalletStatus';

export const useIsLoggedIn = () => {
  return useAuthStore(state => state.step) === 'done';
};

export const useIsEmailWallet = () => {
  const providerType = useAuthStore(state => state.providerType);
  return providerType === MAGIC_PROVIDER_TYPE;
};
