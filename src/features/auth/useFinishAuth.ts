import assert from 'assert';

import * as Sentry from '@sentry/react';
import { identify } from 'features/analytics';

import { DebugLogger } from '../../common-lib/log';
import { useIsCoLinksSite } from '../colinks/useIsCoLinksSite';
import { useFetchManifest } from 'hooks/legacyApi';
import { useToast } from 'hooks/useToast';
import { useWeb3React } from 'hooks/useWeb3React';

import { findConnectorName } from './connectors';
import { login } from './login';
import { useAuthStore } from './store';
import { useLogout } from './useLogout';
import { useSavedAuth } from './useSavedAuth';

const logger = new DebugLogger('auth');

export const useFinishAuth = () => {
  const { showError } = useToast();
  const fetchManifest = useFetchManifest();
  const logout = useLogout();
  const { setSavedAuth, getAndUpdate } = useSavedAuth();
  const web3Context = useWeb3React();
  const setProfileId = useAuthStore(state => state.setProfileId);

  const isCoLinks = useIsCoLinksSite();

  return async () => {
    const { connector, account: address, library, providerType } = web3Context;
    assert(address && library);

    try {
      const connectorName = connector
        ? findConnectorName(connector)
        : providerType;
      assert(connectorName);

      const savedAuth = getAndUpdate(address);
      logger.log('found saved auth data:', savedAuth);
      let profileId = savedAuth.id;
      if (!savedAuth.token) {
        const loginData = await login(address, library, connectorName);
        const token = loginData.token;
        if (!token) return false;

        logger.log('got new auth data:', loginData);
        setSavedAuth(address, { connectorName, ...loginData });
        profileId = loginData.id;
        identify(profileId);
      }

      assert(profileId, 'missing profile ID after login');
      setProfileId(profileId);

      // Send a truncated address to sentry to help us debug customer issues
      Sentry.setTag(
        'address_truncated',
        address.substr(0, 8) + '...' + address.substr(address.length - 8, 8)
      );

      if (isCoLinks) {
        // no need to fetch manifest for colinks
        return Promise.resolve(true);
      }
      // this setTimeout is needed so that the Recoil effects of updateSavedAuth
      // are finished before fetchManifest is called. in particular,
      // setAuthToken needs to be called
      return new Promise(res =>
        setTimeout(() =>
          fetchManifest(profileId)
            .then(() => res(true))
            .catch(() => {
              // we had a cached token & it's invalid, so log out
              // FIXME don't logout if request timed out
              logout();
              res(false);
            })
        )
      );
    } catch (e: any) {
      if (
        [/user denied message signature/i, /user rejected signing/i].some(r =>
          e.message?.match(r)
        )
      ) {
        return false;
      }

      // for debugging this issue
      // eslint-disable-next-line no-console
      console.info(e);
      showError(`Failed to login: ${e.message || e}`);
    }
  };
};
