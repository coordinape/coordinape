import assert from 'assert';

import { identify } from '../analytics';

import { useAuthStore } from './store';
import { useSavedAuth } from './useSavedAuth';

export const useFakeLogin = () => {
  const { setSavedAuth } = useSavedAuth();
  const { setProfileId, setAddress } = useAuthStore(state => state);

  const fakeLogin = async (profileId: number) => {
    const payload = { profileId };
    const resp = await fetch('/api/fakeLogin', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ input: { payload } }),
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
    setSavedAuth(address, { connectorName: 'fake', ...loginData });
    profileId = loginData.id;
    identify(profileId);

    assert(profileId, 'missing profile ID after login');
    setProfileId(profileId);
    setAddress(address);
  };
  return { fakeLogin };
};
