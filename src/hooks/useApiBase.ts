import assert from 'assert';

import { Web3Provider } from '@ethersproject/providers';
import * as Sentry from '@sentry/react';
import { Web3ReactContextInterface } from '@web3-react/core/dist/types';
import debug from 'debug';
import iti from 'itiriri';
import * as queries from 'lib/gql/queries';

import { useRecoilLoadCatch } from 'hooks';
import {
  rSelectedCircleIdSource,
  rCirclesMap,
  rWalletAuth,
} from 'recoilState/app';
import {
  rApiManifest,
  rApiFullCircle,
  rSelfIdProfileMap,
} from 'recoilState/db';
import { getApiService } from 'services/api';
import { connectors } from 'utils/connectors';
import { getSelfIdProfiles } from 'utils/selfIdHelpers';
import { assertDef } from 'utils/tools';

import { useApeSnackbar } from './useApeSnackbar';

import { EConnectorNames } from 'types';

const log = debug('useApiBase');

const clearStateAfterLogout = (set: any) => {
  set(rWalletAuth, { authTokens: {} });
  set(rApiFullCircle, new Map());
  set(rApiManifest, undefined);
};

export const useApiBase = () => {
  const { showError } = useApeSnackbar();

  // FIXME it's a bit inconsistent that this catches its own errors instead of
  // delegating to useRecoilLoadCatch. but we should probably just not use
  // useRecoilLoadCatch at all and instead just get the walletAuth data from an
  // ordinary useRecoilValue hook in RequireAuth
  const finishAuth = useRecoilLoadCatch(
    ({ snapshot, set }) =>
      async ({
        web3Context,
      }: {
        web3Context: Web3ReactContextInterface<Web3Provider>;
      }) => {
        const { authTokens } = await snapshot.getPromise(rWalletAuth);
        const { connector, account: address, library } = web3Context;
        assert(address && library);

        try {
          const connectorName = assertDef(
            Object.entries(connectors).find(
              ([, c]) => connector?.constructor === c.constructor
            )?.[0],
            'Unknown web3Context.connector'
          ) as EConnectorNames;

          const api = getApiService();
          if (!api.provider) api.setProvider(web3Context.library);

          const token = authTokens[address] ?? (await api.login(address)).token;
          if (token) {
            // Send a truncated address to sentry to help us debug customer issues
            Sentry.setTag(
              'address_truncated',
              address.substr(0, 8) +
                '...' +
                address.substr(address.length - 8, 8)
            );
            set(rWalletAuth, {
              connectorName,
              address,
              authTokens: { ...authTokens, [address]: token },
            });

            // wrapped in setTimeout so rWalletAuth is updated before this runs
            return new Promise(res =>
              setTimeout(() =>
                fetchManifest()
                  .then(res)
                  .catch(() => {
                    // we had a cached token & it's invalid
                    clearStateAfterLogout(set);
                    res(false);
                  })
              )
            );
          }
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

  const logout = useRecoilLoadCatch(
    ({ set }) =>
      async () =>
        clearStateAfterLogout(set),
    []
  );

  const fetchSelfIds = useRecoilLoadCatch(
    ({ set }) =>
      async (addresses: string[]) => {
        if (addresses.length === 0) {
          return;
        }
        const profiles = await getSelfIdProfiles(addresses);
        set(rSelfIdProfileMap, om => {
          const result = new Map(om);
          iti(profiles).forEach(p => result.set(p.address, p));
          return result;
        });
      },
    [],
    { hideLoading: true, who: 'fetchSelfIds' }
  );

  const fetchManifest = useRecoilLoadCatch(
    ({ snapshot, set }) =>
      async () => {
        const walletAuth = await snapshot.getPromise(rWalletAuth);
        if (
          !(walletAuth.address && walletAuth.address in walletAuth.authTokens)
        ) {
          throw 'Wallet must be connected to fetch manifest';
        }

        const manifest = await queries.fetchManifest(walletAuth.address);
        set(rApiManifest, manifest);
        return manifest;
      },
    [],
    { who: 'fetchManifest' }
  );

  const fetchCircle = useRecoilLoadCatch(
    ({ snapshot, set }) =>
      async ({ circleId, select }: { circleId: number; select?: boolean }) => {
        const walletAuth = await snapshot.getPromise(rWalletAuth);
        if (
          !(walletAuth.address && walletAuth.address in walletAuth.authTokens)
        ) {
          throw 'Wallet must be connected to fetch manifest';
        }
        if (!(await snapshot.getPromise(rCirclesMap)).has(circleId)) {
          // Wasn't included in their manifest.
          throw `Your profile doesn't have access to ${circleId}`;
        }

        const fullCircle = await queries.getFullCircle(circleId);

        set(rApiFullCircle, m => {
          const result = new Map(m);
          result.set(fullCircle.circle.id, fullCircle);
          return result;
        });
        if (select) {
          set(rSelectedCircleIdSource, circleId);
        }
        fetchSelfIds(fullCircle.users.map(u => u.address));
      },
    [],
    { who: 'fetchCircle' }
  );

  const selectCircle = useRecoilLoadCatch(
    ({ snapshot, set }) =>
      async (circleId: number) => {
        const walletAuth = await snapshot.getPromise(rWalletAuth);
        if (
          !(walletAuth.address && walletAuth.address in walletAuth.authTokens)
        ) {
          throw 'Wallet must be connected to fetch manifest';
        }
        if (circleId === -1) {
          // This signifies no circle selected
          // TODO: Change to use undefined
          set(rSelectedCircleIdSource, undefined);
        }

        if (!walletAuth.address) {
          throw 'Wallet must be connected to fetch circle';
        }
        if (!(await snapshot.getPromise(rCirclesMap)).has(circleId)) {
          // Wasn't included in their manifest.
          throw `Your profile doesn't have access to ${circleId}`;
        }

        if (!(await snapshot.getPromise(rApiFullCircle)).has(circleId)) {
          // Need to fetch this circle
          log(`selectCircle -> fetchCircle ${circleId}`);
          await fetchCircle({ circleId, select: true });
        } else {
          set(rSelectedCircleIdSource, circleId);
        }
      },
    [],
    { who: 'selectCircle' }
  );

  return {
    finishAuth,
    logout,
    fetchManifest,
    fetchCircle,
    selectCircle,
  };
};
