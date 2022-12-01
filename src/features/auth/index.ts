import { useAuthStep } from './useAuthStep';

export { getAuthToken, setAuthToken } from './token';
export { useWalletStatus } from './useWalletStatus';
export { RequireAuth } from './RequireAuth';

export const useIsLoggedIn = () => {
  const [authStep] = useAuthStep();
  return authStep === 'done';
};
