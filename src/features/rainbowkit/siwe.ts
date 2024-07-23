import {
  AuthenticationStatus,
  createAuthenticationAdapter,
} from '@rainbow-me/rainbowkit';
import {
  logoutAndClearSavedAuth,
  setAuthTokenForAddress,
} from 'features/auth/helpers';
import { client } from 'lib/gql/client';
import { generateNonce, SiweMessage } from 'siwe';

import { refreshEmitter } from './refreshEmitter';

export let authState: AuthenticationStatus = 'unauthenticated';

export const setAuthState = (state: AuthenticationStatus) => {
  authState = state;
};

export const getAuthState = () => {
  return authState;
};

export const authenticationAdapter = createAuthenticationAdapter({
  getNonce: async () => {
    let nonce: string;
    try {
      const nonceReq = await fetch('/api/time');
      ({ nonce } = JSON.parse(await nonceReq.text()));
    } catch (e) {
      nonce = generateNonce();
    }
    return nonce;
  },
  createMessage: ({ nonce, address, chainId }) => {
    return new SiweMessage({
      domain: window.location.host,
      address,
      statement: 'Coordinape wants to Sign-In With Ethereum',
      uri: window.location.origin,
      version: '1',
      chainId,
      nonce,
    });
  },
  getMessageBody: ({ message }) => {
    return message.prepareMessage();
  },
  verify: async ({ message, signature }) => {
    try {
      const data = message.prepareMessage();

      const payload = {
        signature,
        hash: '',
        address: message.address,
        data,
        connectorName: 'injected',
      };
      const resp = await fetch('/api/login', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input: { payload } }),
      });

      const loginData = await resp.json();

      setAuthTokenForAddress(loginData.address, loginData.token);
      setAuthState('authenticated');
      refreshEmitter.emit();
      return Boolean(resp.ok);
    } catch (e) {
      console.error(e);
      throw e;
    }
  },
  signOut: async () => {
    try {
      await client.mutate(
        { logoutUser: { id: true } },
        { operationName: 'logout' }
      );
      logoutAndClearSavedAuth();
      refreshEmitter.emit();
    } catch (e) {
      console.error(e);
    }
  },
});
