import React, { ReactNode, useEffect, useMemo, useState } from 'react';

import {
  AuthenticationStatus,
  createAuthenticationAdapter,
  RainbowKitAuthenticationProvider,
} from '@rainbow-me/rainbowkit';
import { generateNonce, SiweMessage } from 'siwe';
import { useAccount } from 'wagmi';

import { client } from '../../lib/gql/client';
import { useAuthStore } from '../auth';
import {
  logoutAndClearSavedAuth,
  reloadAuthFromCookie,
  setAuthTokenForAddress,
} from '../auth/helpers';

import { refreshEmitter } from './refreshEmitter';

type UnconfigurableMessageOptions = {
  address: string;
  chainId: number;
  nonce: string;
};

type ConfigurableMessageOptions = Partial<
  Omit<SiweMessage, keyof UnconfigurableMessageOptions>
> & {
  [_Key in keyof UnconfigurableMessageOptions]?: never;
};

export type GetSiweMessageOptions = () => ConfigurableMessageOptions;

interface RainbowKitSiweProviderProps {
  enabled?: boolean;
  getSiweMessageOptions?: GetSiweMessageOptions;
  children: ReactNode;
}

export function RainbowKitSiweProvider({
  children,
  enabled,
  getSiweMessageOptions,
}: RainbowKitSiweProviderProps) {
  const { address } = useAccount();
  const [authState, setAuthState] = useState<AuthenticationStatus>(
    address ? 'authenticated' : 'unauthenticated'
  );
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

  const adapter = useMemo(
    () =>
      createAuthenticationAdapter({
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

            setAuthTokenForAddress(
              loginData.address,
              loginData.token,
              loginData.id
            );
            setProfileId(loginData.id);
            setAddress(loginData.address);
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
            // TODO: clear out the AuthStore since we aren't calling setProvider anymore
            await client.mutate(
              { logoutUser: { id: true } },
              { operationName: 'logout' }
            );
            logoutAndClearSavedAuth();
            setProfileId(undefined);
            setAddress(undefined);
            setAuthState('unauthenticated');
            refreshEmitter.emit();
          } catch (e) {
            console.error(e);
          }
        },
      }),
    [getSiweMessageOptions]
  );

  return (
    <RainbowKitAuthenticationProvider
      adapter={adapter}
      enabled={enabled}
      status={authState}
    >
      {children}
    </RainbowKitAuthenticationProvider>
  );
}
