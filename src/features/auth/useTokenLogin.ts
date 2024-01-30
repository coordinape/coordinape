import assert from 'assert';

import { identify } from '../analytics';
import { useToast } from 'hooks';

import { useAuthStore } from './store';
import { useSavedAuth } from './useSavedAuth';

export const useTokenLogin = () => {
  const { setSavedAuth } = useSavedAuth();
  const { setProfileId, setAddress } = useAuthStore(state => state);
  const { showSuccess } = useToast();

  const tokenLogin = async (token: string) => {
    const resp = await fetch('/api/tokenLogin', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });

    const loginData = await resp.json();
    if (!resp.ok) {
      throw new Error(
        `${resp.status} ${resp.statusText}: ${
          loginData.error?.message || loginData.message || 'No message'
        }`
      );
    }

    const { address } = loginData;
    setSavedAuth(address, { connectorName: 'token', ...loginData });
    const profileId = loginData.id;
    identify(profileId);

    assert(profileId, 'missing profile ID after login');
    setProfileId(profileId);
    setAddress(address);

    showSuccess('Logged in successfully');
  };
  return { tokenLogin };
};
