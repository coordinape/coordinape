import { useMemo } from 'react';

import { getAuthToken } from '../services/api';

import useConnectedAddress from './useConnectedAddress';

export const useCurrentUserAuthToken = () => {
  const address = useConnectedAddress();

  return useMemo(() => {
    if (!address) return null;

    return getAuthToken();
  }, [address]);
};
