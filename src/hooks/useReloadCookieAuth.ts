import { useEffect } from 'react';

import { reloadAuthFromCookie } from 'features/auth/helpers';
import { useAuthStore } from 'features/auth/store';

export const useReloadCookieAuth = () => {
  const { setProfileId, profileId, setAddress } = useAuthStore();

  useEffect(() => {
    if (!profileId) {
      const fromCookie = reloadAuthFromCookie();
      if (fromCookie && fromCookie.id) {
        setProfileId(fromCookie.id);
        setAddress(fromCookie.address);
      }
    }
  }, [profileId]);

  return { profileId, setProfileId, setAddress };
};
