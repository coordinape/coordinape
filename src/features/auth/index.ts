import { useAuthStore } from './store';

export { getAuthToken, setAuthToken } from './token';
export { useWalletStatus } from './useWalletStatus';
export { RequireAuth } from './RequireAuth';
export { useAuthStore } from './store';

export const useIsLoggedIn = () => {
  return useAuthStore(state => state.step) === 'done';
};
