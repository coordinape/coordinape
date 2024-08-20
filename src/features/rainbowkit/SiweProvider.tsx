import { ReactNode, useEffect, useMemo, useState } from 'react';

import {
  AuthenticationStatus,
  createAuthenticationAdapter,
  RainbowKitAuthenticationProvider,
} from '@rainbow-me/rainbowkit';
import { generateNonce, SiweMessage } from 'siwe';

import { client } from '../../lib/gql/client';
import {
  logoutAndClearSavedAuth,
  setAuthTokenForAddress,
} from '../auth/helpers';
import { useReloadCookieAuth } from 'hooks/useReloadCookieAuth';

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
  const { profileId } = useReloadCookieAuth();

  const [authState, setAuthState] = useState<AuthenticationStatus>(
    profileId ? 'authenticated' : 'unauthenticated'
  );

  const { setProfileId, setAddress } = useReloadCookieAuth();

  // if we load a profileId from cookie, reset authState
  useEffect(() => {
    if (profileId) {
      setAuthState('authenticated');
    } else {
      setAuthState('unauthenticated');
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
