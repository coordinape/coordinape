import assert from 'assert';

import type { Web3Provider } from '@ethersproject/providers';
import * as Sentry from '@sentry/react';

import { useApiBase, useRecoilLoadCatch } from 'hooks';
import { useToast } from 'hooks/useToast';
import type { UseWeb3ReactReturnType } from 'hooks/useWeb3React';

import { findConnectorName } from './connectors';
import { login } from './login';
import { setAuthToken } from './token';
import { useLogout } from './useLogout';
import { rSavedAuth } from './useSavedAuth';

export const useFinishAuth = () => {
  const { showError } = useToast();
  const { fetchManifest } = useApiBase();
  const logout = useLogout();

  // FIXME it's a bit inconsistent that this catches its own errors instead of
  // delegating to useRecoilLoadCatch. but we should probably just not use
  // useRecoilLoadCatch at all and instead just get the walletAuth data from an
  // ordinary useRecoilValue hook in RequireAuth
  return useRecoilLoadCatch(
    ({ set }) =>
      async ({
        web3Context,
        authTokens,
      }: {
        web3Context: UseWeb3ReactReturnType<Web3Provider>;
        authTokens: Record<string, string | undefined>;
      }) => {
        const {
          connector,
          account: address,
          library,
          providerType,
        } = web3Context;
        assert(address && library);

        try {
          const connectorName = connector
            ? findConnectorName(connector)
            : providerType;
          assert(connectorName);

          let token = authTokens[address];
          if (!token) {
            token = (await login(address, library, connectorName)).token;
            setAuthToken(token);
          }

          if (!token) return false;

          // Send a truncated address to sentry to help us debug customer issues
          Sentry.setTag(
            'address_truncated',
            address.substr(0, 8) + '...' + address.substr(address.length - 8, 8)
          );
          const newWalletAuth = {
            connectorName,
            address,
            authTokens: { ...authTokens, [address]: token },
          };
          set(rSavedAuth, newWalletAuth);

          // passing in newWalletAuth because Recoil snapshot is not updated yet
          return new Promise(res =>
            setTimeout(() =>
              fetchManifest(newWalletAuth)
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
            [/User denied message signature/].some(r => e.message?.match(r))
          ) {
            return false;
          }

          // for debugging this issue
          // eslint-disable-next-line no-console
          console.info(e);
          showError(`Failed to login: ${e.message || e}`);
        }
      },
    [],
    { who: 'finishAuth' }
  );
};
